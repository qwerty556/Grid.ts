import LoopGrid from "../src/LoopGrid"

describe("LoopGrid",()=>{

    test("init",()=>{
        const arr = [[1,2,3],[4,5,6],[7,8,9]]

        let lg = new LoopGrid(arr)

        expect(lg.currentFocus().H).toBe(0)
        expect(lg.currentFocus().W).toBe(0)

        lg = new LoopGrid(arr,1)

        expect(lg.currentFocus().H).toBe(1)
        expect(lg.currentFocus().W).toBe(0)
    })

    test("resolutionHW",()=>{
        const arr = [[1,2,3],[4,5,6],[7,8,9]]
        const lg = new LoopGrid(arr)

        const nums = [0,1,2,5,26,77547,68455535253,Math.floor(Number.MAX_SAFE_INTEGER/3),Math.ceil(Number.MIN_SAFE_INTEGER/3)].map(_=>[_,_*-1]).flat(1)
        nums.forEach(_=>{
            const n = 3 * _
            expect(lg.resolutionHW(n,0).H).toBe(0)
            expect(lg.resolutionHW(0,n).W).toBe(0)

            expect(lg.resolutionHW(n,n).H).toBe(0)
            expect(lg.resolutionHW(n,n).W).toBe(0)
        })
    })


    test("HW",()=>{

        const arr = [[1,2,3],[4,5,6],[7,8,9]]

        const lg = new LoopGrid(arr)

        const nums = [0,1,2,5,26,77547,68455535253,Math.floor(Number.MAX_SAFE_INTEGER/3),Math.ceil(Number.MIN_SAFE_INTEGER/3)].map(_=>[_,_*-1]).flat(1)
        
        nums.forEach(_=>{
            const n = 3 * _
            lg.focus(n,1)
            expect(lg.get()).toBe(2)
            expect(lg.currentFocus().H).toBe(0)
            expect(lg.currentFocus().W).toBe(1)

            lg.focus(1,n)
            expect(lg.get()).toBe(4)
            expect(lg.currentFocus().H).toBe(1)
            expect(lg.currentFocus().W).toBe(0)


            lg.focus(1,2)
            lg.move(n,0)
            expect(lg.get()).toBe(6)
            expect(lg.currentFocus().H).toBe(1)
            expect(lg.currentFocus().W).toBe(2)

            lg.focus(1,2)
            lg.move(0,n)
            expect(lg.get()).toBe(6)
            expect(lg.currentFocus().H).toBe(1)
            expect(lg.currentFocus().W).toBe(2)
        })


        lg.focus(1,2)
        lg.move(1,-2)
        expect(lg.get()).toBe(7)
        expect(lg.currentFocus().H).toBe(2)
        expect(lg.currentFocus().W).toBe(0)

        lg.focus(1,2)
        lg.move(0,1)
        expect(lg.get()).toBe(4)
        expect(lg.currentFocus().H).toBe(1)
        expect(lg.currentFocus().W).toBe(0)
    })
})