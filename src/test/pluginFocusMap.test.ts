import Grid from "../Grid"
import FocusedMap from "../plugin/pluginFocusedMap"

describe("pluginFocusedMap", () => {

    const _arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

    test("init", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        g.usePlugin(new FocusedMap(g))

        //focusの初期値は 0,0
        expect(g.currentFocus().H).toBe(0)
        expect(g.currentFocus().W).toBe(0)

        const fMemo = g.$.get("FocusedMap") as FocusedMap<number>

        for (let i = -5; i < 10; i += 1 | 0)
            for (let y = -5; y < 10; y += 1 | 0) {
                if (i !== 0 && y !== 0) {
                    expect(fMemo.countVisits({ H: i, W: y })).toBe(0)
                    expect(fMemo.isVisited({ H: i, W: y })).toBe(false)
                }
            }


        expect(fMemo.countVisits({ H: 0, W: 0 })).toBe(1)
        expect(fMemo.isVisited({ H: 0, W: 0 })).toBe(true)

        g.focus(g.currentFocus())
        expect(fMemo.countVisits({ H: 0, W: 0 })).toBe(2)
        expect(fMemo.isVisited({ H: 0, W: 0 })).toBe(true)

        g.focus(g.currentFocus())
        expect(fMemo.countVisits({ H: 0, W: 0 })).toBe(3)
        expect(fMemo.isVisited({ H: 0, W: 0 })).toBe(true)
    })
})