import Editor from "@/app/init";
import { MAX_HISTORY_LENGTH } from "@/config";

export default class FabricHistory {
  private historyUndo: string[];
  private historyRedo: string[];
  private saving: boolean; // if saving 2 history
  private doing: boolean; // if doing undo or redo
  private currentState: string;
  private canvas: fabric.Canvas | null;
  private editor: Editor;

  constructor(editor: Editor) {
    this.historyUndo = [];
    this.historyRedo = [];
    this.canvas = editor.canvas;
    this.editor = editor;

    this.saving = false;
    this.doing = false;

    this.currentState = this._getJSON();
    this.init();
  }

  private _checkHistoryUndoLength() {
    if (this.historyUndo.length > MAX_HISTORY_LENGTH) {
      this.historyUndo.shift();
    }
  }

  private _checkHistoryRedoLength() {
    if (this.historyRedo.length > MAX_HISTORY_LENGTH) {
      this.historyRedo.shift();
    }
  }

  public _historySaveAction() {
    if (this.doing || this.saving) return;
    this.saving = true;

    const json = this.currentState;
    this.historyUndo.push(json);
    this._checkHistoryUndoLength();
    this.currentState = this._getJSON();

    this.saving = false;
  }

  private _getJSON() {
    return JSON.stringify(this.editor.canvas2Json());
  }

  private init() {
    this.canvas?.on("object:added", this._historySaveAction.bind(this));
    this.canvas?.on("object:removed", this._historySaveAction.bind(this));
    this.canvas?.on("object:modified", this._historySaveAction.bind(this));
    this.canvas?.on("object:skewing", this._historySaveAction.bind(this));
    this.canvas?.on("editor:object:modified", this._historySaveAction.bind(this));
  }

  public dispose() {
    this.canvas?.off("object:added", this._historySaveAction.bind(this));
    this.canvas?.off("object:removed", this._historySaveAction.bind(this));
    this.canvas?.off("object:modified", this._historySaveAction.bind(this));
    this.canvas?.off("object:skewing", this._historySaveAction.bind(this));
    this.canvas?.off("editor:object:modified", this._historySaveAction.bind(this));
  }

  public async undo() {
    const _history = this.historyUndo.pop();
    if (_history) {
      this.doing = true;

      this.historyRedo.push(this.currentState);
      this._checkHistoryRedoLength();
      this.currentState = _history;
      await this.editor.loadFromJSON(_history);

      this.doing = false;
      this.canvas?.fire("editor:history:undo");
    }
  }

  public async redo() {
    const _history = this.historyRedo.pop();
    if (_history) {
      this.doing = true;

      this.historyUndo.push(this.currentState);
      this._checkHistoryUndoLength();
      this.currentState = _history;
      await this.editor.loadFromJSON(_history);

      this.doing = false;
      this.canvas?.fire("editor:history:redo");
    }
  }

  public canUndo() {
    return this.historyUndo.length > 0;
  }

  public canRedo() {
    return this.historyRedo.length > 0;
  }

  public reset() {
    this.historyRedo = [];
    this.historyUndo = [];
    this.saving = false;
    this.doing = false;
    this.currentState = this._getJSON();
  }
}
