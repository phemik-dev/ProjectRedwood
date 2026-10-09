import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const designPath = new URL("../apps/workbench/public/design-004/design.js", import.meta.url);

function focusable(name) {
  return {
    name,
    focus() { this.focused = true; documentState.activeElement = this; },
    hasAttribute() { return false; }
  };
}

const documentState = { activeElement: null };

async function loadDrawerHarness() {
  const source = await readFile(designPath, "utf8");
  const listeners = {};
  const sidebar = { attributes: new Map(), setAttribute(name, value) { this.attributes.set(name, value); }, removeAttribute(name) { this.attributes.delete(name); } };
  const shell = { attributes: new Map(), setAttribute(name, value) { this.attributes.set(name, value); }, removeAttribute(name) { this.attributes.delete(name); } };
  const first = focusable("first");
  const last = focusable("last");
  const opener = focusable("opener");
  const panel = { focus() { this.focused = true; documentState.activeElement = this; }, querySelectorAll() { return [first, last]; } };
  const document = {
    body: { classList: { toggle() {} } },
    get activeElement() { return documentState.activeElement; },
    addEventListener(type, listener) { listeners[type] = listener; },
    querySelector(selector) { if (selector === ".drawer") return panel; if (selector === ".drawer .icon-btn") return first; return null; },
    querySelectorAll(selector) {
      if (selector === "#app > .sidebar, #app > .shell") return [sidebar, shell];
      if (selector === "[data-action]") return [opener];
      return [];
    }
  };
  opener.dataset = { action: "record" };
  const executable = source.replace(/\nloadCanonicalRun\(\);\s*$/, "\nglobalThis.__drawer = { state, protectDrawerBackground, restoreDrawerFocus };");
  const context = { document, URLSearchParams, Intl, location: { search: "" }, window: { scrollTo() {}, alert() {} }, console };
  vm.runInNewContext(executable, context, { filename: designPath.pathname });
  return { api: context.__drawer, listeners, sidebar, shell, first, last, opener };
}

test("Design 004 drawer traps Tab focus, protects its background, and restores the opening control", async () => {
  const { api, listeners, sidebar, shell, first, last, opener } = await loadDrawerHarness();

  api.protectDrawerBackground(true);
  assert.equal(sidebar.inert, true);
  assert.equal(shell.inert, true);
  assert.equal(sidebar.attributes.get("aria-hidden"), "true");

  api.state.drawer = { returnAction: "record", returnElement: opener };
  documentState.activeElement = last;
  let prevented = false;
  listeners.keydown({ key: "Tab", shiftKey: false, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(first.focused, true);

  documentState.activeElement = first;
  listeners.keydown({ key: "Tab", shiftKey: true, preventDefault() {} });
  assert.equal(last.focused, true);

  api.protectDrawerBackground(false);
  assert.equal(sidebar.inert, false);
  assert.equal(sidebar.attributes.has("aria-hidden"), false);
  api.restoreDrawerFocus({ returnAction: "record", returnElement: null });
  assert.equal(opener.focused, true);
});

test("Design 004 drawer is declared as a modal focusable dialog", async () => {
  const source = await readFile(designPath, "utf8");
  const stylesheet = await readFile(new URL("../apps/workbench/public/design-004/healthcare.css", import.meta.url), "utf8");
  assert.match(source, /role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabindex="-1"/);
  assert.match(stylesheet, /body\.drawer-open #app>\.sidebar,body\.drawer-open #app>\.shell\{pointer-events:none/);
});
