import Grid from "../Grid"
import * as PluginResolutionHW from "../plugin/PluginResolutionHW"

describe("pluginFocusedMap", () => {

    const _arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

    test("loop", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        g.usePlugin(new PluginResolutionHW.Loop())

        expect(g.currentFocus()).toStrictEqual({ H: 0, W: 0 })
        expect(g.move({ H: 0, W: 2 }).currentFocus()).toStrictEqual({ H: 0, W: 2 })
        expect(g.move({ H: 2, W: -2 }).currentFocus()).toStrictEqual({ H: 2, W: 0 })

        expect(g.move({ H: 0, W: -1 }).currentFocus()).toStrictEqual({ H: 2, W: 2 })
        expect(g.move({ H: -3, W: 0 }).currentFocus()).toStrictEqual({ H: 2, W: 2 })

        expect(g.move({ H: 2, W: 0 }).currentFocus()).toStrictEqual({ H: 1, W: 2 })
        expect(g.move({ H: 0, W: 2 }).currentFocus()).toStrictEqual({ H: 1, W: 1 })
    })

    test("stop", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        g.usePlugin(new PluginResolutionHW.Stop())

        expect(g.currentFocus()).toStrictEqual({ H: 0, W: 0 })
        expect(g.move({ H: 0, W: 2 }).currentFocus()).toStrictEqual({ H: 0, W: 2 })
        expect(g.move({ H: 2, W: -2 }).currentFocus()).toStrictEqual({ H: 2, W: 0 })

        expect(g.move({ H: 0, W: -1 }).currentFocus()).toStrictEqual({ H: 2, W: 0 })
        expect(g.move({ H: -3, W: 0 }).currentFocus()).toStrictEqual({ H: 0, W: 0 })

        expect(g.move({ H: 3, W: 3 }).currentFocus()).toStrictEqual({ H: 2, W: 2 })
        expect(g.move({ H: -3, W: -3 }).currentFocus()).toStrictEqual({ H: 0, W: 0 })

        expect(g.focus({ H: Number.MAX_SAFE_INTEGER, W: Number.MAX_SAFE_INTEGER }).currentFocus()).toStrictEqual({ H: 2, W: 2 })
        expect(g.focus({ H: Number.MIN_SAFE_INTEGER, W: Number.MIN_SAFE_INTEGER }).currentFocus()).toStrictEqual({ H: 0, W: 0 })
    })
})