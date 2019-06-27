import SubSuper from '@shared/layout/SubSuper';
import CreatorContainer from './CreatorContainer';
import EqComponent from '@shared/layout/EqComponent';
import LayoutState from '@shared/animation/LayoutState';
import { creatorContainerCreatorDraw, childrenToStepLayout } from './CreatorContainerMethods';
import CanvasController from '@shared/main/CanvasController';
import { SubSuperContainerFormat } from '@shared/main/FileFormat';
import C from '@shared/main/consts';
import EqContent from '@shared/layout/EqContent';

export default class CreatorSubSuper extends SubSuper implements CreatorContainer {

    // Used in creator: What to save portrusionProportion as.
    private savePortrusionAs: number;

    addVertically() {
        return false;
    }

    addHorizontally() {
        return false;
    }

    addBefore(e: EqComponent<any>, b: EqComponent<any>) {
        return;
    }

    addAfter(e: EqComponent<any>, b: EqComponent<any>) {
        return;
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = C.creatorContainerStroke;

        // Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        ctx.restore();
        creatorContainerCreatorDraw(l, ctx);
    }

    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        if (x - clickedLayout.tlx < this.padding.left * clickedLayout.scale) {
            const container = clickedLayout.layoutParent.component as unknown as CreatorContainer;
            container.addClickOnChild(clickedLayout, x, y, toAdd);
        } else if (clickedLayout.tlx + clickedLayout.width - x < this.padding.right * clickedLayout.scale) {
            const container = clickedLayout.layoutParent.component as unknown as CreatorContainer;
            container.addClickOnChild(clickedLayout, x, y, toAdd);
        } else {
            return;
        }
    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        return;
    }

    toStepLayout(controller: CanvasController): SubSuperContainerFormat {
        const toReturn: SubSuperContainerFormat = {
            type: 'subSuper',
            top: childrenToStepLayout(this.top.getChildren(), controller),
            middle: childrenToStepLayout(this.middle.getChildren(), controller),
            bottom: childrenToStepLayout(this.bottom.getChildren(), controller)
        };
        if (this.savePortrusionAs) {
            if (this.savePortrusionAs !== C.defaultExpPortrusion) {
                toReturn.portrusion = this.savePortrusionAs;
            }
            this.savePortrusionAs = undefined;
        } else if (this.portrusionProportion !== C.defaultExpPortrusion) {
            toReturn.portrusion = this.portrusionProportion;
        }
        return toReturn;
    }

    delete(toDelete: EqComponent<any>) {
        throw new Error('Cannot delete children from a SubSuper container.');
    }

    forEachUnder(forEach: (content: EqContent<any>) => void) {
        (this.top as unknown as CreatorContainer).forEachUnder(forEach);
        (this.middle as unknown as CreatorContainer).forEachUnder(forEach);
        (this.bottom as unknown as CreatorContainer).forEachUnder(forEach);
    }

    /**
     * Save this SubSuper as having
     * a particular portrusion proportion. The
     * next time toStepLayout is called, this
     * number will be saved, but this container
     * isn't considered to have the proportion.
     * @param saveAs What to save portrusion as.
     */
    savePortrusion(saveAs: number) {
        this.savePortrusionAs = saveAs;
    }
}
