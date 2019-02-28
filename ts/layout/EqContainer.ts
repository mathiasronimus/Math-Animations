import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';
import CanvasController from '../main/CanvasController';
import EqContent from './EqContent';
import C from '../main/consts';
import { tri } from '../main/helpers';

export default abstract class EqContainer<L extends LayoutState> extends EqComponent<L> {

    constructor(padding: Padding) {
        super(padding);
    }

    /**
     * When one of this container's direct
     * children is clicked, add a component
     * adjacent to the clicked child.
     * 
     * @param clickedLayout The layout state generated by the child.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    abstract addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>);

    /**
     * Returns an object representing
     * the step layout that would generate
     * this container.
     */
    abstract toStepLayout(controller: CanvasController): Object;

    /**
     * Delete a child of this container.
     * 
     * @param toDelete The child to delete.
     */
    abstract delete(toDelete: EqComponent<any>);

    /**
     * Runs a function for every piece of
     * content under this container.
     * 
     * @param forEach The function to run for content.
     */
    abstract forEachUnder(forEach: (content: EqContent<any>) => void);

    /**
     * Whether this container lays out components vertically
     * and more can be added.
     */
    protected abstract addVertically(): boolean;

    /**
     * Whether this container lays out components horizontally
     * and more can be added.
     */
    protected abstract addHorizontally(): boolean;

    /**
     * Add a child before another.
     * 
     * @param toAdd The child to add.
     * @param before Add before this child.
     */
    protected abstract addBefore(toAdd: EqComponent<any>, before: EqComponent<any>);

    /**
     * Add a child after another.
     * 
     * @param toAdd The child to add.
     * @param after Add after this child.
     */
    protected abstract addAfter(toAdd: EqComponent<any>, after: EqComponent<any>);

    /**
     * When this container is clicked,
     * add a component to it at some
     * position. This default implementation
     * adds the component adjacent to this one
     * in the parent container of this container.
     * 
     * @param clickedLayout The layout state (generated by this container) that was clicked.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        let parentLayout = clickedLayout.layoutParent;
        if (!parentLayout) {
            // Can't add, no parent container
            return;
        }
        let container = parentLayout.component as EqContainer<any>;
        if (container.addVertically()) {
            // Add on top or bottom
            if (clickedLayout.onTop(y)) {
                // Add before this
                container.addBefore(toAdd, this);
            } else {
                // Add after this
                container.addAfter(toAdd, this);
            }
        } else if (container.addHorizontally()) {
            // Add on left or right
            if (clickedLayout.onLeft(x)) {
                // Add before this
                container.addBefore(toAdd, this);
            } else {
                // Add after this
                container.addAfter(toAdd, this);
            }
        } else {
            // Can't add inside this type of container
            return;
        }
    }

    /**
     * Draws the container on the canvas,
     * only used in the creator. This default
     * implementation draws carets on the outer
     * half of the padding, depending on the
     * parent container.
     * 
     * @param l The layout of this container.
     * @param ctx The graphics context to draw to.
     */
    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D): void {
        let parentLayout = l.layoutParent;
        if (!parentLayout) {
            return;
        }
        let pad = new Padding(
            C.creatorContainerPadding.top * l.scale,
            C.creatorContainerPadding.left * l.scale,
            C.creatorContainerPadding.bottom * l.scale,
            C.creatorContainerPadding.right * l.scale
        );
        let container: EqContainer<any> = parentLayout.component as EqContainer<any>;
        if (container.addVertically()) {
            // Add carets on top and bottom facing outwards
            ctx.save();
            ctx.fillStyle = C.creatorCaretFillStyleLighter;

            ctx.save();
            ctx.translate(l.tlx + l.width / 2, l.tly + pad.top / 4);
            ctx.rotate(Math.PI);
            tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
            ctx.restore();

            ctx.save();
            ctx.translate(l.tlx + l.width / 2, l.tly + l.height - pad.bottom / 4);
            tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
            ctx.restore();

            ctx.restore();

        } else if (container.addHorizontally()) {
            // Add carets on left and right facing outwards
            ctx.save();
            ctx.fillStyle = C.creatorCaretFillStyleLighter;

            ctx.save();
            ctx.translate(l.tlx + pad.left / 4, l.tly + l.height / 2);
            ctx.rotate(Math.PI / 2);
            tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
            ctx.restore();

            ctx.save();
            ctx.translate(l.tlx + l.width - pad.right / 4, l.tly + l.height / 2);
            ctx.rotate(-Math.PI / 2);
            tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
            ctx.restore();

            ctx.restore();
        }
    }

    /**
     * Returns an array of children of a container
     * as used in the step layout.
     * 
     * @param children The children array.
     * @param controller The canvas controller possessing this container.
     */
    protected static childrenToStepLayout(children: EqComponent<any>[], controller: CanvasController) {
        let toReturn = [];
        children.forEach(comp => {
            if (comp instanceof EqContainer) {
                toReturn.push(comp.toStepLayout(controller));
            } else if (comp instanceof EqContent) {
                toReturn.push(comp.getRef());
            } else {
                throw "unrecognized type " + typeof comp;
            }
        });
        return toReturn;
    }
}