function Container({ children, className = "", ...props }) {
  return (
    <div className={`shell ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Container;
