//@ts-nocheck

import fabric from "fabric";
import Editor from "../";
import { LOAD_FROM_LOCAL_WHEN_INIT, AUTO_SAVE_WHEN_CHANGE } from "@/config";

export default class AutoSave {
  private canvas: fabric.Canvas;
  private editor: Editor;
  private saving: boolean;
  private canSave: boolean;

  constructor(editor: Editor) {
    this.canvas = editor.canvas;
    this.editor = editor;

    this.saving = false;
    this.canSave = true;

    this.init();
  }

  public init() {
    if (AUTO_SAVE_WHEN_CHANGE) {
      this.canvas.on(this.initAutoSaveEvents());
    }
  }

  public dispose() {
    if (AUTO_SAVE_WHEN_CHANGE) {
      this.canvas.off(this.initAutoSaveEvents());
    }
  }

  public setCanSave(can: boolean) {
    this.canSave = can;
  }

  private autoSaveAction() {
    if (this.saving) return;
    this.saving = true;
    console.log("saving", "SAVING");
    try {
      if (this.canSave) {
        localStorage.setItem("canvas_json", this._getJSON());
      }
    } catch (e) {
      console.log(e);
    }

    this.saving = false;
  }

  private _getJSON() {
    return JSON.stringify(this.editor.canvas2Json());
  }

  private initAutoSaveEvents() {
    return {
      "object:added": this.autoSaveAction.bind(this),
      "object:removed": this.autoSaveAction.bind(this),
      "object:modified": this.autoSaveAction.bind(this),
      "object:skewing": this.autoSaveAction.bind(this),
      "fabritor:object:modified": this.autoSaveAction.bind(this),
    };
  }

  public async loadFromLocal() {
    if (LOAD_FROM_LOCAL_WHEN_INIT) {
      try {
        const jsonStr = localStorage.getItem("canvas_json");
        if (jsonStr) {
          const json = JSON.parse(jsonStr);
          console.log(json, "JSON PARSE");
          await this.editor.loadFromJSON(json);
        }
      } catch (e) {
        console.log(e, "ERROR");
      }
    }
  }
}
