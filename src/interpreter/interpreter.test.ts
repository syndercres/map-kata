import {
    interpret,
    execute,
    Registers,
    substituteRegisterValues,
    MsgStructure,
} from "./interpreter";
import { OtherState } from "./types";
test("original codewars tests pass", function () {
    expect(
        interpret(["mov a -10", "mov b a", "inc a", "dec b", "jnz a -2"])
    ).toEqual({ a: 0, b: -20 });

    expect(
        interpret(["mov a 5", "inc a", "dec a", "dec a", "jnz a -1", "inc a"])
    ).toEqual({ a: 1 });
});

function defaultOtherState(): OtherState {
    return { lastComparisonResult: null, storedOutput: null };
}

test("execute mov a <- 5 works", function () {
    const regs: Registers = {};
    const ipOffset = execute(
        { command: "mov", toRegister: "a", sourceRegOrValue: 5 },
        regs,
        defaultOtherState()
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 5 });
});

test("execute mov a <- b works", function () {
    const regs: Registers = { b: 99 };
    const ipOffset = execute(
        { command: "mov", toRegister: "a", sourceRegOrValue: "b" },
        regs,
        defaultOtherState()
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 99, b: 99 });
});

test("execute mul a, b works", function () {
    const regs: Registers = { b: 3 };
    const ipOffset = execute(
        { command: "mul", toRegister: "b", sourceRegOrValue: "b" },
        regs,
        defaultOtherState()
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ b: 9 });
});

test("execute add a, b works", function () {
    const regs: Registers = { b: 3 };
    const ipOffset = execute(
        { command: "add", toRegister: "b", sourceRegOrValue: 10 },
        regs,
        defaultOtherState()
    );

    expect(regs).toEqual({ b: 13 });
    expect(ipOffset).toEqual(1);
});

test("execute inc a", function () {
    const regs: Registers = { a: 3, b: 100 };
    const ipOffset = execute(
        { command: "inc", registerName: "a" },
        regs,
        defaultOtherState()
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 4, b: 100 });
});

test("execute dec b", function () {
    const regs: Registers = { a: 3, b: 100 };
    const ipOffset = execute(
        { command: "dec", registerName: "b" },
        regs,
        defaultOtherState()
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 3, b: 99 });
});

test("execute jnz c -5 does not jump when not zero", function () {
    const regs: Registers = { a: 0, b: 100, c: 2 };
    const ipOffset = execute(
        { command: "jnz", registerName: "a", offset: -5 },
        regs,
        defaultOtherState()
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 0, b: 100, c: 2 });
});

test("execute jnz c -5 jumps when zero", function () {
    const regs: Registers = { a: 3, b: 100, c: 0 };
    const ipOffset = execute(
        { command: "jnz", registerName: "a", offset: -5 },
        regs,
        defaultOtherState()
    );

    expect(ipOffset).toEqual(-5);
    expect(regs).toEqual({ a: 3, b: 100, c: 0 });
});

test("execute cmp", function () {
    const regs: Registers = { a: 3, b: 2, c: 0 };
    const otherState: OtherState = defaultOtherState();

    const ipOffset = execute(
        { command: "cmp", x: 3, y: "b" },
        regs,
        otherState
    );

    expect(otherState.lastComparisonResult).toEqual("gt");
    expect(regs).toEqual({ a: 3, b: 2, c: 0 });
    expect(ipOffset).toEqual(1);
});

test("execute cmp", function () {
    const regs: Registers = { a: 3, b: 2, c: 0 };
    const otherState: OtherState = {
        lastComparisonResult: "eq",
        storedOutput: null,
    };

    const ipOffset = execute(
        { command: "cmp", x: "b", y: "a" },
        regs,
        otherState
    );

    expect(otherState.lastComparisonResult).toEqual("lt");
    expect(regs).toEqual({ a: 3, b: 2, c: 0 });
    expect(ipOffset).toEqual(1);
});

test("execute msg", function () {
    const regs: Registers = { a: 3, b: 2, c: 0 };
    const otherState: OtherState = {
        lastComparisonResult: "eq",
        storedOutput: null,
    };

    const ipOffset = execute(
        {
            command: "msg",
            message: [{ type: "literal", value: "blah blah blah" }],
        },
        regs,
        otherState
    );

    expect(otherState.storedOutput).toEqual("blah blah blah");
});

test("message substitution", function () {
    const components: MsgStructure = [
        { type: "literal", value: "10/2=" },
        { type: "registerName", value: "k" },
        { type: "literal", value: "the end" },
    ];
    const regs: Registers = { k: 5 };

    expect(substituteRegisterValues(components, regs)).toBe("10/2=5the end");
});