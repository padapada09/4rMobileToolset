export interface PromptAction {
    title : string
    value : string,
}

export interface PromptOptions {
    title : string,
    content? : string,
    input?: boolean | string,
    actions : Array<Array<PromptAction>>
}

export interface PromptProps {
    style? : {
        card?: Object,
        button?: Object,
        actions?: Object,
        title?: Object,
        content?: Object,
        text?: Object,
        input?: Object
    },
    options : PromptOptions,
    onSubmit : (value:object) => void
}