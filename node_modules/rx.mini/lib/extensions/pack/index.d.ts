import { Event } from "../../core";
export default function Pack(): {
    event: <T extends any[]>() => Event<T>;
    finishAll: () => void;
};
