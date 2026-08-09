import './MeetingCard.css'

export default function MeetingCard({ date, time }) {
    return (
        <div className="meeting-card">
            <span className="meeting-label">
                Próxima reunião
            </span>

            <strong>{date}</strong>

            <span>{time}</span>
        </div>
    )
}