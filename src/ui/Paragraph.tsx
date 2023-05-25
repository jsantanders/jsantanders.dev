/**
 * Renders a paragraph with a margin bottom of 5px
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props component props
 * @returns {React.ReactElement} React component
 */
export const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return <p className="my-5 leading-relaxed lg:text-2md" {...props} />;
};
