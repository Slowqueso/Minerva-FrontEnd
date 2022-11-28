import Link from "next/link";
const TextWithHyperlink = ({ text, href, hyperlink, onClick }) => {
  return (
    <div className="flex-together">
      <h3 className="label f-12">{text}</h3>
      {href ? (
        <Link href={href}>
          <h3 className="f-12 hyperlink">{hyperlink}</h3>
        </Link>
      ) : (
        <h3 className="f-12 hyperlink" onClick={onClick}>
          {hyperlink}
        </h3>
      )}
    </div>
  );
};

export default TextWithHyperlink;
