import './GoogleBusinessWidget.css';

const GoogleBusinessWidget = () => {
  // Static reviews from Google Business Profile
  // Update these manually when you get new reviews on Google
  // To get reviews: Go to https://www.google.com/maps/place/Grindcast+Studio
  // Copy the reviews and update this array
  
  console.log('GoogleBusinessWidget rendering...');
  
  const reviews = [
    {
      author: "Jakub Blaho",
      rating: 5,
      text: "Vynikajúce priestory, priateľský personál, parkovanie zadarmo. Celkovo veľmi dobrý zážitok a tvorba",
      date: "2024-11-04"
    },
    {
      author: "David Pohanka",
      rating: 5,
      text: "Krásne priestory a výhoda v parkovaní",
      date: "2024-11-03"
    },
    {
      author: "Alex Chen",
      rating: 5,
      text: "Služby na vysokej úrovni.",
      date: "2024-11-03"
    }
  ];

  console.log('Reviews count:', reviews.length);

  return (
    <section id="recenzie" className="section reviews-section">
      <div className="section-header">
        <span className="section-overline">Recenzie</span>
        <h2>Čo hovoria naši klienti</h2>
      </div>

      <div className="reviews-container">
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <div className="review-author">
                  <div className="author-avatar">
                    {review.author.charAt(0)}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{review.author}</div>
                    <div className="review-date">{review.date}</div>
                  </div>
                </div>
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="review-text">{review.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoogleBusinessWidget;

