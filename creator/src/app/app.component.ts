import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import Icon from './Icon';
import { UndoRedoService } from './undo-redo.service';
import { CentralAreaComponent } from './central-area/central-area.component';
import { ContentSelectionService } from './content-selection.service';
import { ContentPaneComponent } from './content-pane/content-pane.component';
import { ModalDirective } from './modal.directive';
import { ModalService } from './modal.service';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { LoadComponent } from './load/load.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  defaultLeftIcons: Icon[];
  defaultRightIcons: Icon[];

  selectedLeftIcons: Icon[];
  selectedRightIcons: Icon[];

  @ViewChild(CentralAreaComponent)
  centre: CentralAreaComponent;

  @ViewChild(ContentPaneComponent)
  content: ContentPaneComponent;

  private modalHostVar: ModalDirective;
  displayingModal = false;
  // Function called when the modal is shown,
  // passed a directive with a ViewContainerRef
  // of the inner modal container.
  // once set, only called once.
  onModalShow: (modalHost: ModalDirective) => void;

  constructor(private undoRedo: UndoRedoService,
              private selection: ContentSelectionService,
              private modal: ModalService,
              public cd: ChangeDetectorRef) {
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.load = this.load.bind(this);
    this.deselect = this.deselect.bind(this);
    this.modal.appComponent = this;
    this.defaultLeftIcons = [];
    this.defaultRightIcons = [
      new Icon('save', this.save, () => true),
      new Icon('get_app', this.load, () => true),
      new Icon('play_arrow', this.play, () => true),
      new Icon('undo', this.undo, this.undoRedo.canUndo),
      new Icon('redo', this.redo, this.undoRedo.canRedo)
    ];
    this.selectedLeftIcons = [
      new Icon('clear', this.deselect, () => true)
    ];
    this.selectedRightIcons = [
      new Icon('delete', () => {
        this.selection.canvasInstance.delete();
      }, () => this.selection.canvasInstance.canDelete()),
      new Icon('palette', () => {
        this.modal.show(ColorPickerComponent);
      }, () => true)
    ];
    this.undoRedo.publishChange(this.getDefaultInitialState());
  }

  @ViewChild(ModalDirective)
  set modalHost(newModalHost: ModalDirective) {
    this.modalHostVar = newModalHost;
    if (this.onModalShow) {
      this.onModalShow(this.modalHostVar);
    }
    this.onModalShow = undefined;
  }

  get modalHost() {
    return this.modalHostVar;
  }

  /**
   * Get the state displayed when the creator
   * is first loaded.
   */
  private getDefaultInitialState(): any {
    return {
      steps: [{
        root: {
          type: 'vbox',
          children: []
        }
      }],
      terms: []
    };
  }

  /**
   * Get the icons to be displayed on the
   * left based on the current state.
   */
  getLeftIcons() {
    if (this.selection.selectedOnCanvas) {
      return this.selectedLeftIcons;
    } else {
      return this.defaultLeftIcons;
    }
  }

  /**
   * Get the icons to be displayed on the
   * right based on the current state.
   */
  getRightIcons() {
    if (this.selection.selectedOnCanvas) {
      return this.selectedRightIcons;
    } else {
      return this.defaultRightIcons;
    }
  }

  /**
   * Redraw the canvas.
   */
  redraw() {
    this.centre.controller.redraw();
  }

  /**
   * When a component is dropped not on the
   * canvas, stop the adding behavior.
   * @param e The drag event.
   */
  stopDrag(e: DragEvent) {
    e.preventDefault();
    this.selection.adding = undefined;
    this.content.dragging = false;
  }

  /**
   * Deselect anything on the content pane
   * and canvas.
   */
  deselect() {
    this.selection.adding = undefined;
    this.selection.selectedOnCanvas = undefined;
  }

  /**
   * Roll back to the last state.
   */
  undo() {
    this.deselect();
    this.undoRedo.undo();
  }

  /**
   * Undo the last undo.
   */
  redo() {
    this.deselect();
    this.undoRedo.redo();
  }

  /**
   * Save the current state to a file.
   */
  save() {
    console.log('save');
  }

  /**
   * Load from a file.
   */
  load() {
    this.modal.show(LoadComponent);
  }

  /**
   * Play the current state.
   */
  play() {
    console.log('play');
  }
}
