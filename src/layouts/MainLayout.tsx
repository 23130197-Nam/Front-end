import type { ReactNode } from 'react'
import './MainLayout.css'

type MainLayoutProps = {
    sidebar: ReactNode
    children: ReactNode
}

export default function MainLayout({ sidebar, children }: MainLayoutProps) {
    return (
        <div className="chat-layout">
            <aside className="chat-sidebar" aria-labelledby="chat-sidebar-title">
                <header className="chat-sidebar__header">
                    <h2 id="chat-sidebar-title">Tin nhắn</h2>
                    <p>Các cuộc trò chuyện của bạn</p>
                </header>

                <div className="chat-sidebar__content">{sidebar}</div>
            </aside>

            <section className="chat-content" aria-labelledby="chat-page-title">
                {children}
            </section>
        </div>
    )
}
