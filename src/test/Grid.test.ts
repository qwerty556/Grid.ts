import Grid from "../Grid"

describe("Grid", () => {

    const _arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

    test("init", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)

        //focusの初期値は 0,0
        expect(g.currentFocus().H).toBe(0)
        expect(g.currentFocus().W).toBe(0)

        //focusの初期値は 指定可能
        const g2 = Grid.of(arr, { H: 2, W: 1 })
        expect(g2.currentFocus().H).toBe(2)
        expect(g2.currentFocus().W).toBe(1)
    })

    test("forcus,move", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)

        expect(g.currentFocus()).toStrictEqual({ H: 0, W: 0 })
        expect(g.focus({ H: 1, W: 2 }).currentFocus()).toStrictEqual({ H: 1, W: 2 })
        expect(g.focus({ H: 2, W: 0 }).currentFocus()).toStrictEqual({ H: 2, W: 0 })

        expect(g.move({ H: 0, W: 2 }).currentFocus()).toStrictEqual({ H: 2, W: 2 })
        expect(g.move({ H: 0, W: -2 }).currentFocus()).toStrictEqual({ H: 2, W: 0 })
        expect(g.move({ H: -1, W: 0 }).currentFocus()).toStrictEqual({ H: 1, W: 0 })
    })

    test("get", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)

        expect(g.focus({ H: 0, W: 0 }).exist()).toBe(true)
        expect(g.focus({ H: 0, W: 0 }).get()).toBe(1)

        expect(g.focus({ H: 1, W: 0 }).exist()).toBe(true)
        expect(g.focus({ H: 1, W: 0 }).get()).toBe(4)

        expect(g.focus({ H: 1, W: 2 }).exist()).toBe(true)
        expect(g.focus({ H: 1, W: 2 }).get()).toBe(6)

        //存在しない
        expect(g.focus({ H: 1, W: 3 }).exist()).toBe(false)
        expect(g.focus({ H: 1, W: 3 }).get()).toBe(undefined)
    })

    test("put", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)

        expect(g.focus({ H: 0, W: 0 }).put(200)).toBe(200)
        expect(g.get()).toBe(200)

        expect(g.focus({ H: 0, W: 2 }).put(300)).toBe(300)
        expect(g.get()).toBe(300)

        expect(g.focus({ H: 2, W: 0 }).put(400)).toBe(400)
        expect(g.get()).toBe(400)

        //存在しない
        expect(g.focus({ H: 3, W: 0 }).exist()).toBe(false)
        expect(g.focus({ H: 3, W: 0 }).put(500)).toBe(undefined)


        expect(g.focus({ H: 0, W: 0 }).get()).toBe(200)
        expect(g.focus({ H: 0, W: 2 }).get()).toBe(300)
        expect(g.focus({ H: 2, W: 0 }).get()).toBe(400)
        expect(g.focus({ H: 3, W: 0 }).get()).toBe(undefined)
    })

    test("toArray,unwrap", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const ex = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        expect(g.toArray().flat(1)).toStrictEqual(ex)
        expect(g.unwrap().flat(1)).toStrictEqual(ex)

        g.eventHooks.interceptToArray.push((_: number[][], g) => _.map((__: number[]) => __.map(n => n * 2)))

        expect(g.toArray().flat(1)).toStrictEqual(ex.map(n => n * 2))
        expect(g.unwrap().flat(1)).toStrictEqual(ex)
    })

    test("beforeFocus", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.focus({ H: 0, W: 1 }).eventHooks.beforeFocus.push((_new: GridFocus, g) => {
            res.push([_new.H, _new.W, 1].join("@"))
        })

        g.eventHooks.beforeFocus.push((_new: GridFocus, g) => {
            res.push([_new.H, _new.W, 2].join("|"))
        })

        g.focus({ H: 2, W: 0 })

        expect(res.shift()).toStrictEqual([2, 0, 1].join("@"))
        expect(res.shift()).toStrictEqual([2, 0, 2].join("|"))
    })

    test("afterFocus", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.focus({ H: 0, W: 1 }).eventHooks.afterFocus.push((old: GridFocus, g) => {
            res.push([old.H, old.W, 1].join("@"))
        })

        g.eventHooks.afterFocus.push((old: GridFocus, g) => {
            res.push([old.H, old.W, 2].join("|"))
        })

        g.focus({ H: 2, W: 0 })

        expect(res.shift()).toStrictEqual([0, 1, 1].join("@"))
        expect(res.shift()).toStrictEqual([0, 1, 2].join("|"))
    })

    test("interceptForcus", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.focus({ H: 0, W: 1 }).eventHooks.interceptForcus.push((_new: GridFocus, g) => {
            res.push("A")
            res.push(_new)
            return _new
        })

        g.eventHooks.interceptForcus.push((_new: GridFocus, g) => {
            res.push("B")
            res.push(_new)
            return { H: Math.min(0, _new.H), W: _new.W - 2 }
        })

        g.eventHooks.interceptForcus.push((_new: GridFocus, g) => {
            res.push("C")
            res.push(_new)
            return _new
        })

        g.focus({ H: 2, W: 2 })

        expect(res.shift()).toBe("A")
        expect(res.shift()).toStrictEqual({ H: 2, W: 2 })

        expect(res.shift()).toBe("B")
        expect(res.shift()).toStrictEqual({ H: 2, W: 2 })

        expect(res.shift()).toBe("C")
        expect(res.shift()).toStrictEqual({ H: 0, W: 0 })

        expect(g.currentFocus()).toStrictEqual({ H: 0, W: 0 })
    })

    test("beforeGet", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.eventHooks.beforeGet.push((current, g) => {
            res.push([current, 1].join("@"))
        })

        g.eventHooks.beforeGet.push((current, g) => {
            res.push([current, 2].join("|"))
        })

        g.focus({ H: 0, W: 1 }).get()

        expect(res.shift()).toBe([2, 1].join("@"))
        expect(res.shift()).toBe([2, 2].join("|"))

        g.focus({ H: 1, W: 1 }).get()
        expect(res.shift()).toBe([5, 1].join("@"))
        expect(res.shift()).toBe([5, 2].join("|"))
    })

    test("afterGet", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.eventHooks.afterGet.push((old, g) => {
            res.push([old, 1].join("@"))
        })

        g.eventHooks.afterGet.push((old, g) => {
            res.push([old, 2].join("|"))
        })

        g.focus({ H: 0, W: 1 }).get()

        expect(res.shift()).toBe([2, 1].join("@"))
        expect(res.shift()).toBe([2, 2].join("|"))

        g.focus({ H: 1, W: 1 }).get()
        expect(res.shift()).toBe([5, 1].join("@"))
        expect(res.shift()).toBe([5, 2].join("|"))
    })

    test("interceptGet", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.eventHooks.interceptGet.push((got, g) => {
            res.push("A")
            res.push(got)
            return got + 100
        })

        g.eventHooks.interceptGet.push((got, g) => {
            res.push("B")
            res.push(got)
            return got + 200
        })

        g.focus({ H: 0, W: 1 }).get()

        expect(res.shift()).toBe("A")
        expect(res.shift()).toBe(2)

        expect(res.shift()).toBe("B")
        expect(res.shift()).toBe(2 + 100)

        expect(g.get()).toBe(2 + 100 + 200)

        g.eventHooks.interceptGet.splice(0)

        expect(g.get()).toBe(2)
    })


    test("beforePut", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.eventHooks.beforePut.push((_new, g) => {
            res.push([_new, 1].join("@"))
        })

        g.eventHooks.beforePut.push((_new, g) => {
            res.push([_new, 2].join("|"))
        })

        expect(g.focus({ H: 0, W: 1 }).put(20)).toBe(20)
        expect(g.get()).toBe(20)
        expect(res.shift()).toBe([20, 1].join("@"))
        expect(res.shift()).toBe([20, 2].join("|"))
    })

    test("afterPut", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.eventHooks.afterPut.push((old, g) => {
            res.push([old, 1].join("@"))
        })

        g.eventHooks.afterPut.push((old, g) => {
            res.push([old, 2].join("|"))
        })


        expect(g.focus({ H: 0, W: 1 }).put(20)).toBe(20)
        expect(g.get()).toBe(20)
        expect(res.shift()).toBe([2, 1].join("@"))
        expect(res.shift()).toBe([2, 2].join("|"))
    })

    test("interceptPut", () => {

        const arr = _arr.map(_ => _.slice())

        const g = Grid.of(arr)
        const res = []

        g.eventHooks.interceptPut.push((_new, g) => {
            res.push("A")
            res.push(_new)
            return _new + 100
        })

        g.eventHooks.interceptPut.push((_new, g) => {
            res.push("B")
            res.push(_new)
            return _new + 200

        })

        g.focus({ H: 0, W: 1 }).put(10)

        expect(res.shift()).toBe("A")
        expect(res.shift()).toBe(10)

        expect(res.shift()).toBe("B")
        expect(res.shift()).toBe(10 + 100)

        expect(g.get()).toBe(10 + 100 + 200)
    })
})