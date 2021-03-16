

declare global {
    interface GridFocus {
        H:number,
        W:number
    }

    interface GridEventHooks<T> {
        readonly beforeFocus:Array<((HW:GridFocus)=>void)>,
        readonly afterFocus :Array<((oldHW:GridFocus,HW:GridFocus)=>void)>,
        readonly interceptForcus:Array<((HW:GridFocus)=>GridFocus)>,

        readonly beforeBlur:Array<((HW:GridFocus)=>void)>,
        readonly afterBlur :Array<((oldHW:GridFocus,HW:GridFocus)=>void)>,

        readonly beforePut  :Array<((t:T)=>void)>,
        readonly afterPut   :Array<((t:T)=>void)>,
        readonly interceptPut:Array<((t:T)=>T)>,

        readonly afterChange   :Array<((t:T)=>void)>,

        readonly beforeGet  :Array<(()=>void)>,
        readonly afterGet   :Array<((t:T)=>void)>,
        readonly interceptGet:Array<((t:T)=>T)>,

        readonly interceptToArray:Array<((_:T[][])=>T[][])>,
    }

    interface GridPlugin<T> {
        handler:(grid:Grid<T>)=>void
    }
}

class Grid<T> {

    readonly $ = {}

    readonly eventHooks:GridEventHooks<T> = {
        beforeFocus:[],afterFocus:[],interceptForcus:[],
        beforePut:[],afterPut:[],interceptPut:[],
        afterChange:[],
        beforeGet:[],afterGet:[],interceptGet:[],
        interceptToArray:[],
    } as GridEventHooks<T>

    private readonly grid:T[][] = []
    private focusW:number = -1
    private focusH:number = -1
    
    private constructor(initdata:T[][]) {
        this.grid = initdata
    }

    static of<T>(initdata:T[][],initfocusH=0,initfocusW=0):Grid<T>{
        return new Grid<T>(initdata).focus({H:initfocusH,W:initfocusW})
    }

    usePlugin(plugin:GridPlugin<T>){
        plugin.handler(this)
        return this
    }

    toArray():T[][]{
        return this.eventHooks.interceptToArray.reduce((__,_)=>_(__),this.grid.map(_=>_.slice()))
    }

    unwrap():T[][]{
        return this.grid
    }

    eventHook(eventHookHandler:(eventHooks:GridEventHooks<T>)=>void):Grid<T>{
        eventHookHandler(this.eventHooks)
        return this
    }

    /**
     * 絶対位置でフォーカス先を指定
     * @param H 
     * @param W 
     * @returns
     */
    focus(HW:GridFocus):Grid<T>{

        const currentFocus_ = this.currentFocus()

        this.eventHooks.beforeBlur.forEach(_=>_(currentFocus_))
        this.eventHooks.beforeFocus.forEach(_=>_(HW))
        

        const HW_:GridFocus = this.eventHooks.interceptForcus.reduce((__,_)=>_(__),this.currentFocus())
        this.focusW = HW_.W
        this.focusH = HW_.H

        this.eventHooks.afterBlur.forEach(_=>_(currentFocus_,this.currentFocus()))
        this.eventHooks.afterFocus.forEach(_=>_(HW_,HW))
        
        return this
    }

    /**
     * 相対位置でフォーカス先を指定,他はforcusメソッドと同じ
     * @param H 
     * @param W 
     * @returns 
     */
    move(HW:GridFocus):Grid<T>{
        return this.focus({H:HW.H+this.focusH,W:HW.W+this.focusW})
    }

    currentFocus():GridFocus{
        return {
            H:this.focusH,
            W:this.focusW
        } as GridFocus
    }

    put(t:T):T{
        this.eventHooks.beforePut.forEach(_=>_(t))

        const oldval:T = this.grid[this.focusH][this.focusW]
        const newval = this.eventHooks.interceptPut.reduce((t_:T,_)=>_(t_),t)

        if(oldval !== newval){

            this.grid[this.focusH][this.focusW] = newval

            this.eventHooks.afterChange.forEach(_=>_(oldval))
        }

        this.eventHooks.afterPut.forEach(_=>_(t))
        return oldval
    }

    get():T{
        this.eventHooks.beforeGet.forEach(_=>_())

        const t_ = this.eventHooks.interceptGet.reduce((t_:T,_)=>_(t_),this.grid[this.focusH][this.focusW])

        this.eventHooks.afterGet.forEach(_=>_(t_))
        return t_
    }

    exist(HW:GridFocus):boolean{
        const between = (min:number,max:number) => (n:number) => min <= n && n <= max
        const H_ = between(0,this.grid.length-1)(HW.H)
        const W_ = ()=>between(0,this.grid[HW.H].length-1)(HW.W)
        return H_ && W_()
    }
}


export default Grid