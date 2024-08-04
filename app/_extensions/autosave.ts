import { fabric } from "fabric";
import Editor from "../init";
import { LOAD_FROM_LOCAL_WHEN_INIT, AUTO_SAVE_WHEN_CHANGE } from "@/config";

export default class AutoSave {
  private canvas: fabric.Canvas | null;
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
      this.canvas?.on("object:added", this.autoSaveAction.bind(this));
      this.canvas?.on("object:removed", this.autoSaveAction.bind(this));
      this.canvas?.on("object:modified", this.autoSaveAction.bind(this));
      this.canvas?.on("object:skewing", this.autoSaveAction.bind(this));
      this.canvas?.on("fabritor:object:modified", this.autoSaveAction.bind(this));
    }
  }

  public dispose() {
    if (AUTO_SAVE_WHEN_CHANGE) {
      this.canvas?.off("object:added", this.autoSaveAction.bind(this));
      this.canvas?.off("object:removed", this.autoSaveAction.bind(this));
      this.canvas?.off("object:modified", this.autoSaveAction.bind(this));
      this.canvas?.off("object:skewing", this.autoSaveAction.bind(this));
      this.canvas?.off("fabritor:object:modified", this.autoSaveAction.bind(this));
    }
  }

  public setCanSave(can: boolean) {
    this.canSave = can;
  }

  private autoSaveAction() {
    if (this.saving) return;
    this.saving = true;
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

  public async loadFromLocal() {
    if (LOAD_FROM_LOCAL_WHEN_INIT) {
      try {
        const jsonStr = localStorage.getItem("canvas_json");
        if (jsonStr) {
          const json = JSON.parse(jsonStr);
          await this.editor.loadFromJSON(json);
        }
      } catch (e) {
        console.log(e, "ERROR");
      }
    }
  }
}
