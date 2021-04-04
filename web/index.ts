import { ParsedRequest, FileType } from '../api/_lib/types';
const { H, R, copee } = (window as any);
let timeout = -1;

interface ImagePreviewProps {
    src: string;
    onclick: () => void;
    onload: () => void;
    onerror: () => void;
    loading: boolean;
}

const ImagePreview = ({ src, onclick, onload, onerror, loading }: ImagePreviewProps) => {
    const style = {
        filter: loading ? 'blur(5px)' : '',
        opacity: loading ? 0.1 : 1,
    };
    const title = 'Click to copy image URL to clipboard';
    return H('a',
        { className: 'image-wrapper', href: src, onclick },
        H('img',
            { src, onload, onerror, style, title }
        )
    );
}

interface DropdownOption {
    text: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onchange: (val: string) => void;
    small: boolean;
}

const Dropdown = ({ options, value, onchange, small }: DropdownProps) => {
    const wrapper = small ? 'select-wrapper small' : 'select-wrapper';
    const arrow = small ? 'select-arrow small' : 'select-arrow';
    return H('div',
        { className: wrapper },
        H('select',
            { onchange: (e: any) => onchange(e.target.value) },
            options.map(o =>
                H('option',
                    { value: o.value, selected: value === o.value },
                    o.text
                )
            )
        ),
        H('div',
            { className: arrow },
            '▼'
        )
    );
}

interface InputProps {
    type?: string;
    value: string;
    oninput: (val: string) => void;
}

const Input = ({ type, value, oninput }: InputProps) => {
    return H('div',
        { className: 'input-outer-wrapper' },
        H('div',
            { className: 'input-inner-wrapper' },
            H('input',
                { type: type || 'text', value, oninput: (e: any) => oninput(e.target.value) }
            )
        )
    );
}

interface ButtonProps {
    label: string;
    onclick: () => void;
}

const Button = ({ label, onclick }: ButtonProps) => {
    return H('button', { onclick }, label);
}

interface FieldProps {
    label: string;
    input: any;
}

const Field = ({ label, input }: FieldProps) => {
    return H('div',
        { className: 'field' },
        H('label',
            H('div', { className: 'field-label' }, label),
            H('div', { className: 'field-value' }, input),
        ),
    );
}

interface ToastProps {
    show: boolean;
    message: string;
}

const Toast = ({ show, message }: ToastProps) => {
    const style = { transform: show ? 'translate3d(0,-0px,-0px) scale(1)' : '' };
    return H('div',
        { className: 'toast-area' },
        H('div',
            { className: 'toast-outer', style },
            H('div',
                { className: 'toast-inner' },
                H('div',
                    { className: 'toast-message' },
                    message
                )
            )
        ),
    );
}

const fileTypeOptions: DropdownOption[] = [
    { text: 'PNG', value: 'png' },
    { text: 'JPEG', value: 'jpeg' },
];

const fontSizeOptions: DropdownOption[] = Array
    .from({ length: 10 })
    .map((_, i) => i * 25)
    .filter(n => n > 0)
    .map(n => ({ text: n + 'px', value: n + 'px' }));

const markdownOptions: DropdownOption[] = [
    { text: 'Plain Text', value: '0' },
    { text: 'Markdown', value: '1' },
];

const iconSizeOptions = [
    { text: 'height', value: 'auto' },
    { text: '50', value: '50' },
    { text: '100', value: '100' },
    { text: '150', value: '150' },
    { text: '200', value: '200' },
    { text: '250', value: '250' },
    { text: '300', value: '300' },
    { text: '350', value: '350' },
];

interface AppState extends ParsedRequest {
    loading: boolean;
    showToast: boolean;
    messageToast: string;
    iconSize: string[];
    overrideUrl: URL | null;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
    const setLoadingState = (newState: Partial<AppState>) => {
        window.clearTimeout(timeout);
        if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
            newState.overrideUrl = state.overrideUrl;
        }
        if (newState.overrideUrl) {
            timeout = window.setTimeout(() => setState({ overrideUrl: null }), 200);
        }

        setState({ ...newState, loading: true });
    };
    const {
        fileType = 'png',
        fontSize = '100px',
        fontColor = 'black',
        text = '自動でOGを生成',
        md = true,
        icons = [],
        iconSize = [],
        showToast = false,
        messageToast = '',
        loading = true,
        overrideUrl = null,
        background = '',
        fontWeight = 400
    } = state;
    const mdValue = md ? '1' : '0';
    const url = new URL(window.location.origin);
    url.pathname = `${encodeURIComponent(text)}.${fileType}`;
    url.searchParams.append('md', mdValue);
    url.searchParams.append('fontSize', fontSize);
    url.searchParams.append('background', encodeURIComponent(background))
    url.searchParams.append('fontColor', encodeURIComponent(fontColor))
    url.searchParams.append('fontWeight', String(fontWeight))
    for (let icon of icons) {
        url.searchParams.append('icons', encodeURIComponent(icon));
    }
    for (let size of iconSize) {
        url.searchParams.append('iconSize', size);
    }

    return H('div',
        { className: 'split' },
        H('div',
            { className: 'pull-left' },
            H('div',
                H(Field, {
                    label: 'ファイルタイプ',
                    input: H(Dropdown, {
                        options: fileTypeOptions,
                        value: fileType,
                        onchange: (val: FileType) => setLoadingState({ fileType: val })
                    })
                }),
                H(Field, {
                    label: 'フォントサイズ',
                    input: H(Dropdown, {
                        options: fontSizeOptions,
                        value: fontSize,
                        onchange: (val: string) => setLoadingState({ fontSize: val })
                    })
                }),
                H(Field, {
                    label: 'フォントカラー',
                    input: H(Input, {
                        value: fontColor,
                        oninput: (val: string) => setLoadingState({ fontColor: val })
                    })
                }),
                H(Field, {
                    label: 'フォントウェイト',
                    input: H(Input, {
                        value: fontWeight,
                        oninput: (val: string) => setLoadingState({ fontWeight: val })
                    })
                }),
                H(Field, {
                    label: 'テキスト形式',
                    input: H(Dropdown, {
                        options: markdownOptions,
                        value: mdValue,
                        onchange: (val: string) => setLoadingState({ md: val === '1' })
                    })
                }),
                H(Field, {
                    label: 'テキストを入力',
                    input: H(Input, {
                        value: text,
                        oninput: (val: string) => {
                            console.log('oninput ' + val);
                            setLoadingState({ text: val });
                        }
                    })
                }),
                H(Field, {
                    label: '背景画像URL',
                    input: H(Input, {
                        value: background,
                        oninput: (val: string) => setLoadingState({ background: val, overrideUrl: url })
                    })
                }),
                ...icons.map((icon, i) => H(Field, {
                    label: H('a',
                        { href: `https://iconify.design/icon-sets/`, target: "_blank" },
                        `Icon ${i + 1} Choose From iconify`
                    ),
                    input: H('div',
                        H(Input, {
                            value: icon,
                            oninput: (val: string) => {
                                if (!val.trim()) {
                                    return
                                }
                                let clone = [...icons];
                                clone[i] = val;
                                setLoadingState({ icons: clone, overrideUrl: url });
                            }
                        }),
                        H('div',
                            { className: 'field-flex' },
                            H(Dropdown, {
                                options: iconSizeOptions,
                                value: iconSize[i],
                                small: true,
                                onchange: (val: string) => {
                                    let clone = [...iconSize];
                                    clone[i] = val;
                                    setLoadingState({ iconSize: clone, overrideUrl: url });
                                }
                            })
                        ),
                        H('div',
                            { className: 'field-flex' },
                            H(Button, {
                                label: `Remove Image ${i + 1}`,
                                onclick: (e: MouseEvent) => {
                                    e.preventDefault();
                                    const filter = (arr: any[]) => [...arr].filter((_, n) => n !== i);
                                    const iconsClone = filter(icons);
                                    const iconSizeClone = filter(iconSize);
                                    setLoadingState({ icons: iconsClone, iconSize: iconSizeClone, overrideUrl: url });
                                }
                            })
                        )
                    )
                })),
                H(Field, {
                    label: H('a',
                        { href: `https://iconify.design/icon-sets/`, target: "_blank" },
                        `Icon ${icons.length + 1} Choose From iconify`
                    ),
                    input: H(Button, {
                        label: `Add Image ${icons.length + 1}`,
                        onclick: () => {
                            const nextImage = '';
                            setState({ icons: [...icons, nextImage] })
                        }
                    }),
                }),
            )
        ),
        H('div',
            { className: 'pull-right' },
            H(ImagePreview, {
                src: overrideUrl ? overrideUrl.href : url.href,
                loading: loading,
                onload: () => setState({ loading: false }),
                onerror: () => {
                    setState({ showToast: true, messageToast: 'Oops, an error occurred' });
                    setTimeout(() => setState({ showToast: false }), 2000);
                },
                onclick: (e: Event) => {
                    e.preventDefault();
                    const success = copee.toClipboard(url.href);
                    if (success) {
                        setState({ showToast: true, messageToast: 'Copied image URL to clipboard' });
                        setTimeout(() => setState({ showToast: false }), 3000);
                    } else {
                        window.open(url.href, '_blank');
                    }
                    return false;
                }
            })
        ),
        H(Toast, {
            message: messageToast,
            show: showToast,
        })
    );
};

R(H(App), document.getElementById('app'));
