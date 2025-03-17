"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSizeMask = exports.vintEncode = exports.UNKNOWN_SIZE = exports.getEBMLByteLength = exports.build = exports.unknownSizeElement = exports.element = exports.string = exports.vintEncodedNumber = exports.float = exports.number = exports.bytes = exports.Element = exports.Value = void 0;
const typedArrayUtils_1 = require("./typedArrayUtils");
class Value {
    constructor(bytes) {
        Object.defineProperty(this, "bytes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: bytes
        });
    }
    write(buf, pos) {
        buf.set(this.bytes, pos);
        return pos + this.bytes.length;
    }
    countSize() {
        return this.bytes.length;
    }
}
exports.Value = Value;
class Element {
    constructor(id, children, isSizeUnknown) {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: id
        });
        Object.defineProperty(this, "children", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: children
        });
        Object.defineProperty(this, "size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sizeMetaData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const bodySize = this.children.reduce((p, c) => p + c.countSize(), 0);
        this.sizeMetaData = isSizeUnknown
            ? exports.UNKNOWN_SIZE
            : (0, exports.vintEncode)((0, typedArrayUtils_1.numberToByteArray)(bodySize, (0, exports.getEBMLByteLength)(bodySize)));
        this.size = this.id.length + this.sizeMetaData.length + bodySize;
    }
    write(buf, pos) {
        buf.set(this.id, pos);
        buf.set(this.sizeMetaData, pos + this.id.length);
        return this.children.reduce((p, c) => c.write(buf, p), pos + this.id.length + this.sizeMetaData.length);
    }
    countSize() {
        return this.size;
    }
}
exports.Element = Element;
const bytes = (data) => {
    return new Value(data);
};
exports.bytes = bytes;
const number = (num) => {
    return (0, exports.bytes)((0, typedArrayUtils_1.numberToByteArray)(num));
};
exports.number = number;
const float = (num) => (0, exports.bytes)((0, typedArrayUtils_1.float32bit)(num));
exports.float = float;
const vintEncodedNumber = (num) => {
    return (0, exports.bytes)((0, exports.vintEncode)((0, typedArrayUtils_1.numberToByteArray)(num, (0, exports.getEBMLByteLength)(num))));
};
exports.vintEncodedNumber = vintEncodedNumber;
const string = (str) => {
    return (0, exports.bytes)((0, typedArrayUtils_1.stringToByteArray)(str));
};
exports.string = string;
const element = (id, child) => {
    return new Element(id, Array.isArray(child) ? child : [child], false);
};
exports.element = element;
const unknownSizeElement = (id, child) => {
    return new Element(id, Array.isArray(child) ? child : [child], true);
};
exports.unknownSizeElement = unknownSizeElement;
const build = (v) => {
    const b = new Uint8Array(v.countSize());
    v.write(b, 0);
    return b;
};
exports.build = build;
const getEBMLByteLength = (num) => {
    if (num < 0x7f) {
        return 1;
    }
    else if (num < 0x3fff) {
        return 2;
    }
    else if (num < 0x1fffff) {
        return 3;
    }
    else if (num < 0xfffffff) {
        return 4;
    }
    else if (num < 0x7ffffffff) {
        return 5;
    }
    else if (num < 0x3ffffffffff) {
        return 6;
    }
    else if (num < 0x1ffffffffffff) {
        return 7;
    }
    else if (num < 0x20000000000000n) {
        return 8;
    }
    else if (num < 0xffffffffffffffn) {
        throw new Error("EBMLgetEBMLByteLength: number exceeds Number.MAX_SAFE_INTEGER");
    }
    else {
        throw new Error("EBMLgetEBMLByteLength: data size must be less than or equal to " +
            (2 ** 56 - 2));
    }
};
exports.getEBMLByteLength = getEBMLByteLength;
exports.UNKNOWN_SIZE = new Uint8Array([
    0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
]);
const vintEncode = (byteArray) => {
    byteArray[0] = (0, exports.getSizeMask)(byteArray.length) | byteArray[0];
    return byteArray;
};
exports.vintEncode = vintEncode;
const getSizeMask = (byteLength) => {
    return 0x80 >> (byteLength - 1);
};
exports.getSizeMask = getSizeMask;
//# sourceMappingURL=ebml.js.map