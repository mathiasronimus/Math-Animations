import LayoutState from '@shared/animation/LayoutState';
import EqComponent from '@shared/layout/EqComponent';
import CanvasController from '@shared/main/CanvasController';
import { ContainerFormat } from '@shared/main/FileFormat';
import EqContent from '@shared/layout/EqContent';

/**
 * Interface implemented by containers to
 * add editing functionality.
 */
export default interface CreatorContainer {

    /**
     * When one of this container's direct
     * children is clicked, add a component
     * adjacent to the clicked child.
     * @param clickedLayout The layout state generated by the child.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>): void;

    /**
     * Returns an object representing
     * the step layout that would generate
     * this container.
     */
    toStepLayout(controller: CanvasController): ContainerFormat;

    /**
     * Delete a child of this container.
     * @param toDelete The child to delete.
     */
    delete(toDelete: EqComponent<any>): void;

    /**
     * Runs a function for every piece of
     * content under this container.
     * @param forEach The function to run for content.
     */
    forEachUnder(forEach: (content: EqContent<any>) => void): void;

    /**
     * Whether this container lays out components vertically
     * and more can be added.
     */
    addVertically(): boolean;

    /**
     * Whether this container lays out components horizontally
     * and more can be added.
     */
    addHorizontally(): boolean;

    /**
     * Add a child before another.
     * @param toAdd The child to add.
     * @param before Add before this child.
     */
    addBefore(toAdd: EqComponent<any>, before: EqComponent<any>): void;

    /**
     * Add a child after another.
     * @param toAdd The child to add.
     * @param after Add after this child.
     */
    addAfter(toAdd: EqComponent<any>, after: EqComponent<any>): void;

    /**
     * When this container is clicked,
     * add a component to it at some
     * position. This default implementation
     * adds the component adjacent to this one
     * in the parent container of this container.
     * @param clickedLayout The layout state (generated by this container) that was clicked.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>): void;

    /**
     * Draws the container on the canvas,
     * only used in the creator. This default
     * implementation draws carets on the outer
     * half of the padding, depending on the
     * parent container.
     * @param l The layout of this container.
     * @param ctx The graphics context to draw to.
     */
    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D): void;

}
