import './ProgressBar.css'

export default function ProgressBar({ current, goal }) {

    const percentage = Math.min((current / goal) * 100, 100)

    return (
        <div className="weekly-progress">
            <div className="progress-info">
                <span>Meta semanal</span>
                <span>{current}h / {goal}h</span>
            </div>

            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="progress-hours">
                <span>0h</span>
                <span>{goal}h</span>
            </div>
        </div>
    )
}