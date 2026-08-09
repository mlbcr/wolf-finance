import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-content">

                <div className="footer-brand">
                    <strong>Wolf Finance</strong>
                    <span>Gestão e acompanhamento da liga</span>
                </div>

                <div className="footer-right">

                    <nav className="footer-links">

                        <a href="https://wolf-finance-rj.github.io/">
                            Sobre a Liga
                        </a>

                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=rh.wolffinance.rh@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contato
                        </a>

                    </nav>
                    <span className="footer-copyright">
                        © 2026 Wolf Finance
                    </span>

                </div>
            </div>
        </footer>
    )
}