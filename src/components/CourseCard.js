import { useNavigate } from 'react-router-dom';

function CourseCard({ course, onPurchase, user, isPurchasing }) {
  const navigate = useNavigate();

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    backgroundColor: "white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  };

  const imageStyle = {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px"
  };

  const titleStyle = {
    fontSize: "1.5rem",
    marginBottom: "10px",
    color: "#333"
  };

  const descriptionStyle = {
    color: "#666",
    marginBottom: "15px",
    lineHeight: "1.5"
  };

  const metaStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#888",
    fontSize: "0.9rem",
    marginBottom: "15px"
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  };

  const viewButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    flex: "1"
  };

  const buyButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    flex: "1"
  };

  const disabledButtonStyle = {
    ...buyButtonStyle,
    backgroundColor: "#ccc",
    cursor: "not-allowed"
  };

  const handleViewCourse = (e) => {
    e.stopPropagation();
    navigate(`/courses/${course.id}`);
  };

  const handleBuyCourse = (e) => {
    e.stopPropagation();
    if (onPurchase) {
      onPurchase(course.id);
    }
  };

  return (
    <div style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
         onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
      {course.image_url && (
        <img src={course.image_url} alt={course.title} style={imageStyle} />
      )}
      <h3 style={titleStyle}>{course.title}</h3>
      <p style={descriptionStyle}>{course.description}</p>
      <div style={metaStyle}>
        <span>{course.modules_count || 0} modules</span>
      </div>
      
      <div style={buttonContainerStyle}>
        <button 
          style={viewButtonStyle} 
          onClick={handleViewCourse}
        >
          Voir le cours
        </button>
        
        {user ? (
          <button 
            style={isPurchasing ? disabledButtonStyle : buyButtonStyle} 
            onClick={handleBuyCourse}
            disabled={isPurchasing}
          >
            {isPurchasing ? 'Achat...' : 'Acheter'}
          </button>
        ) : (
          <button 
            style={buyButtonStyle} 
            onClick={() => window.location.href = '/login'}
          >
            Se connecter
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;