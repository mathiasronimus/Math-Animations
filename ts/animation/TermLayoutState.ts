import LayoutState from "./LayoutState";
import Padding from "../layout/Padding";
import C from '../main/consts';

export default class TermLayoutState extends LayoutState {
    
    padding: Padding = C.termPadding;

    /**
     * Change this layout state to
     * reflect a Term in a tight
     * layout. This reduces padding
     * and width.
     * 
     * @param widthDiff The difference in width between a tight and normal term.
     */
    tighten(widthDiff: number): void {
        this.padding = C.tightTermPadding;
        this.width -= widthDiff;
    }

    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    withZeroScale(): LayoutState {
        return new TermLayoutState( this.layoutParent, 
                                this.component,
                                this.tlx,
                                this.tly,
                                this.width, 
                                this.height,
                                0);
    }
}