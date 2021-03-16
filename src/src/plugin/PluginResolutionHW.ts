import Grid from "../Grid"

declare global {
    interface ResolutionHWLogic {
        readonly loop:(n:number,len:number)=>number,
        readonly stop:(n:number,len:number)=>number,
    }
}

export const resolutionHWLogics = {
    loop:(N:number,length:number):number=>{
        return (
            N < 0 
            ? N - (Math.ceil(N*-1/length) *-1 * length)
            : N - (Math.floor(N/length) * length)
        )
    },
    stop:(N:number,length:number):number=>{
        return N < 0 ? 0 : Math.min(N,length -1)
    }
}

export class Loop<T> implements GridPlugin<T> {
    handler<T>(grid:Grid<T>):void{
        grid.eventHook(_=>{
            _.interceptForcus.push((HW)=>{
                const H_ = resolutionHWLogics.loop(HW.H,grid.unwrap().length)
                const W_ = resolutionHWLogics.loop(HW.W,grid.unwrap()[H_].length)
                return {
                    H:H_,
                    W:W_
                }
            })
        })
    }
}

export class Stop<T> implements GridPlugin<T> {
    handler<T>(grid:Grid<T>):void{
        grid.eventHook(_=>{
            _.interceptForcus.push((HW)=>{
                const H_ = resolutionHWLogics.stop(HW.H,grid.unwrap().length)
                const W_ = resolutionHWLogics.stop(HW.W,grid.unwrap()[H_].length)
                return {
                    H:H_,
                    W:W_
                }
            })
        })
    }
}

/**
 * 縦はloop 横は stop
 */
export class HLoopWStop<T> implements GridPlugin<T> {
    handler<T>(grid:Grid<T>):void{
        grid.eventHook(_=>{
            _.interceptForcus.push((HW)=>{
                const H_ = resolutionHWLogics.loop(HW.H,grid.unwrap().length)
                const W_ = resolutionHWLogics.stop(HW.W,grid.unwrap()[H_].length)
                return {
                    H:H_,
                    W:W_
                }
            })
        })
    }
}

/**
 * 縦はstop 横は loop
 */
export class HStopWLoop<T> implements GridPlugin<T> {
    handler<T>(grid:Grid<T>):void{
        grid.eventHook(_=>{
            _.interceptForcus.push((HW)=>{
                const H_ = resolutionHWLogics.stop(HW.H,grid.unwrap().length)
                const W_ = resolutionHWLogics.loop(HW.W,grid.unwrap()[H_].length)
                return {
                    H:H_,
                    W:W_
                }
            })
        })
    }
}


