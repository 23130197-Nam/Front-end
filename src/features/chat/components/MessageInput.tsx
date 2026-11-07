import { useId, useRef, useState, type FormEvent } from 'react'
import './MessageInput.css'

type MessageInputProps = {
    onSend: (content: string) => void
}

export default function MessageInput({ onSend }: MessageInputProps) {
    const [content, setContent] = useState('')
    const inputId = useId()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedContent = content.trim()

        if (!trimmedContent) {
            return
        }

        onSend(trimmedContent)
        setContent('')
        inputRef.current?.focus()
    }

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <div className="message-input__field">
                <label className="message-input__label" htmlFor={inputId}>
                    Tin nhắn
                </label>
                <input
                    ref={inputRef}
                    id={inputId}
                    className="message-input__control"
                    type="text"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Nhập tin nhắn..."
                    autoComplete="off"
                />
            </div>

            <button
                className="message-input__send"
                type="submit"
                disabled={!content.trim()}
            >
                Gửi
            </button>
        </form>
    )
}
