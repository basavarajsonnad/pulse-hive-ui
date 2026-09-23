import "@/i18n";
import { t, type TOptions } from "i18next";

const translator = (key: string, options?: TOptions) => t(key, options);

export default translator;
