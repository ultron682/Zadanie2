import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { StateEffect, ChangeSet } from "@codemirror/state";
import {
  Update,
  receiveUpdates,
  sendableUpdates,
  collab,
  getSyncedVersion,
} from "@codemirror/collab";
import * as signalR from "@microsoft/signalr";

// Initialize the SignalR connection
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5555/codesharehub", {
    withCredentials: false,
  })
  .withAutomaticReconnect()
  .build();

// Start the connection
connection
  .start()
  .catch((err) => console.error("SignalR connection error:", err));

function pushUpdates(version, fullUpdates) {
  const updates = fullUpdates.map((u) => ({
    clientID: u.clientID,
    changes: u.changes.toJSON(),
    effects: u.effects,
  }));

  return new Promise((resolve) => {
    connection
      .invoke("PushUpdates", version, JSON.stringify(updates))
      .then((status) => resolve(status))
      .catch((err) => {
        console.error("Error pushing updates:", err);
        resolve(false);
      });
  });
}

export const pullUpdates = (version) => {
  return new Promise((resolve) => {
    connection
      .invoke("PullUpdates", version)
      .then((updatesJson) => resolve(JSON.parse(updatesJson)))
      .catch((err) => {
        console.error("Error pulling updates:", err);
        resolve([]);
      });
  }).then((updates) =>
    updates.map((u) => ({
      changes: ChangeSet.fromJSON(u.changes),
      clientID: u.clientID,
    }))
  );
}

export const getDocument= () => {
  return new Promise((resolve) => {
    connection
      .invoke("GetDocument")
      .then(([version, doc]) =>
        resolve({
          version,
          doc: Text.of(doc.split("\n")),
        })
      )
      .catch((err) => {
        console.error("Error getting document:", err);
        resolve({ version: 0, doc: Text.of([]) });
      });
  });
}

export const peerExtension = (startVersion) => {
  const plugin = ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.view = view;
        this.pushing = false;
        this.done = false;
        this.pull();
      }

      update(update) {
        if (update.docChanged || update.transactions.length) this.push();
      }

      async push() {
        const updates = sendableUpdates(this.view.state);
        if (this.pushing || !updates.length) return;
        this.pushing = true;
        const version = getSyncedVersion(this.view.state);
        const success = await pushUpdates(version, updates);
        this.pushing = false;
        if (sendableUpdates(this.view.state).length)
          setTimeout(() => this.push(), 100);
      }

      async pull() {
        while (!this.done) {
          const version = getSyncedVersion(this.view.state);
          const updates = await pullUpdates(version);
          this.view.dispatch(receiveUpdates(this.view.state, updates));
        }
      }

      destroy() {
        this.done = true;
      }
    }
  );

  return [collab({ startVersion }), plugin];
};
