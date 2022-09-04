const TextWithHyperlink = ({ text, href, hyperlink }) => {
  return (
    <div className="flex-together">
      <h3 className="label f-12">{text}</h3>
      <a href={href} className="f-12">
        {hyperlink}
      </a>
    </div>
  );
};

export default TextWithHyperlink;
