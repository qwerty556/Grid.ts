

declare global {
    interface GridFocus {
        H:number,
        W:number
    }

    interface GridEventHooks<T> {
        readonly beforeFocus:Array<((_new:GridFocus,grid:Grid<T>)=>void)>,
        readonly afterFocus :Array<((old:GridFocus,grid:Grid<T>)=>void)>,
        readonly interceptForcus:Array<((renew:GridFocus,grid:Grid<T>)=>GridFocus)>,

        readonly beforePut  :Array<((_new:T,grid:Grid<T>)=>void)>,
        readonly afterPut   :Array<((old:T,grid:Grid<T>)=>void)>,
        readonly interceptPut:Array<((renew:T,grid:Grid<T>)=>T)>,

        readonly beforeGet  :Array<((current:T,grid:Grid<T>)=>void)>,
        readonly afterGet   :Array<((old:T,grid:Grid<T>)=>void)>,
        readonly interceptGet:Array<((got:T,grid:Grid<T>)=>T)>,

        readonly interceptToArray:Array<((_:T[][],grid:Grid<T>)=>T[][])>,
    }

    interface GridPlugin {
        handler:<T>(grid:Grid<T>)=>void
    }
}

class Grid<T> {

    readonly $ = new Map<string,GridPlugin>()

    readonly eventHooks:GridEventHooks<T> = {
        beforeFocus:[],afterFocus:[],interceptForcus:[],
        beforeGet:[],afterGet:[],interceptGet:[],
        beforePut:[],afterPut:[],interceptPut:[],
        interceptToArray:[],
    } as GridEventHooks<T>

    private readonly grid:T[][] = []
    private focusW:number = -1
    private focusH:number = -1
    
    private constructor(initdata:T[][]) {
        this.grid = initdata
    }

    static of<T>(initdata:T[][],initfocus:GridFocus={H:0,W:0}):Grid<T>{
        return (new Grid<T>(initdata)).focus(initfocus)
    }

    usePlugin(plugin:GridPlugin):void{
        plugin.handler(this)
    }

    toArray():T[][]{
        return this.eventHooks.interceptToArray.reduce((__,_)=>_(__,this),this.grid)
    }

    unwrap():T[][]{
        return this.grid
    }

    /**
     * 絶対位置でフォーカス先を指定
     * @param H 
     * @param W 
     * @returns
     */
    focus(HW:GridFocus):Grid<T>{

        const old = this.currentFocus()

        this.eventHooks.beforeFocus.forEach(_=>_(HW,this))

        const HW_:GridFocus = this.eventHooks.interceptForcus.reduce((__,_)=>_(__,this),HW)
        this.focusW = HW_.W
        this.focusH = HW_.H

        this.eventHooks.afterFocus.forEach(_=>_(old,this))
        
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

        if(!this.exist(this.currentFocus())){
            return undefined
        }

        const old:T = this.grid[this.focusH][this.focusW]
        this.eventHooks.beforePut.forEach(_=>_(t,this))

        this.grid[this.focusH][this.focusW] = this.eventHooks.interceptPut.reduce((_new:T,_)=>_(_new,this),t)

        this.eventHooks.afterPut.forEach(_=>_(old,this))

        return this.grid[this.focusH][this.focusW]
    }

    get():T{

        if(!this.exist(this.currentFocus())){
            return undefined
        }

        const old = this.grid[this.focusH][this.focusW]

        this.eventHooks.beforeGet.forEach(_=>_(this.grid[this.focusH][this.focusW],this))

        const res = this.eventHooks.interceptGet.reduce((got:T,_)=>_(got,this),this.grid[this.focusH][this.focusW])

        this.eventHooks.afterGet.forEach(_=>_(old,this))

        return res
    }

    exist(HW:GridFocus=this.currentFocus()):boolean{
        const between = (min:number,max:number) => (n:number) => min <= n && n <= max
        const H_ = between(0,this.grid.length-1)(HW.H)
        const W_ = ()=>between(0,this.grid[HW.H].length-1)(HW.W)
        return H_ && W_()
    }
}


export default Grid