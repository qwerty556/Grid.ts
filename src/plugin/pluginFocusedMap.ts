import Grid from "../Grid"

export default class FocusedMap<T> implements GridPlugin {
    private memo = new Map<number, Map<number, number>>()
    private grid: Grid<T>

    constructor(grid: Grid<T>) {
        this.grid = grid
    }

    isVisited(HW: GridFocus): boolean {
        return this.countVisits(HW) > 0
    }

    countVisits(HW: GridFocus): number {
        const H: Map<number, number> | undefined = this.memo.get(HW.H)
        if (H === undefined) {
            return 0
        }
        const W = H.get(HW.W)
        return W === undefined ? 0 : W
    }

    recording(HW: GridFocus): number {

        const H: Map<number, number> | undefined = this.memo.get(HW.H)
        if (H !== undefined && H.has(HW.W)) {
            H.set(HW.W, H.get(HW.W) + 1)
            return H.get(HW.W)
        } else {
            const W = new Map<number, number>()
            W.set(HW.W, 1)
            this.memo.set(HW.H, (new Map<number, number>()).set(HW.W, 1))
            return 1
        }
    }

    handler<T>(grid: Grid<T>): void {
        const event = () => this.recording(grid.currentFocus())
        event()
        grid.eventHooks.afterFocus.push(event)

        grid.$.set("FocusedMap", this)
    }
}