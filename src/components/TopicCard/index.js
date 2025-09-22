import React from "react";
import './style.scss';
export default function TopicCard({ topic }) {
    return (
        <div className="topic-card">
            
            <img src={topic.imageUrl} alt={topic.title} className="topic-image" />
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
        </div>
    );
}
