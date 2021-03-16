import Grid from "../Grid"

declare global {
    interface FocusMemoI<T> {
        readonly isVisited:(_:GridFocus)=>boolean,
        readonly numOfVisits:(_:GridFocus)=>number,
        readonly recording:(_:GridFocus)=>number,
        readonly clear:(_:GridFocus)=>number,
        readonly clearAll:()=>number[][],
        readonly setHistoryLimit:(limit:number)=>FocusMemoC<T>,
    }
}

export class FocusMemoC<T> implements FocusMemoI<T>{
    private memo:number[][]
    private history:GridFocus[] = []
    private historyLimit = 1000
    private grid:Grid<T>
    constructor(grid:Grid<T>){
        this.grid = grid
        this.memo = Array.from({length:grid.unwrap().length},(_,i)=>Array.from({length:grid.unwrap()[i].length},_=>0))
    }

    setHistoryLimit(limit:number):FocusMemoC<T>{
        this.historyLimit = limit
        return this
    }

    isVisited(HW:GridFocus):boolean{
        return this.numOfVisits(HW) > 0
    }

    numOfVisits(HW:GridFocus):number{
        return this.grid.exist(HW) ? this.memo[HW.H][HW.W] : 0
    }

    recording(HW:GridFocus):number{
        this.history.push(HW)
        if(this.historyLimit >= 0 && this.history.length > this.historyLimit){
            this.history.splice(0,this.history.length - this.historyLimit)
        }
        return this.memo[HW.H][HW.W] += 1
    }

    clearAll():number[][]{
        const old = this.memo
        this.memo = this.memo.map(_=>_.map(__=>0))
        return old
    }

    clear(HW:GridFocus):number{
        const old = this.memo[HW.H][HW.W]
        this.memo[HW.H][HW.W] = 0
        return old
    }
}

export default class FocusMemo<T> implements GridPlugin<T> {
    handler<T>(grid:Grid<T>):void{
        const FocusMemoC_ = new FocusMemoC(grid)
        grid.$["FocusMemo"] = FocusMemoC_
        grid.eventHook(_=>{
            _.beforeFocus.push(FocusMemoC_.recording)
        })
    }
}