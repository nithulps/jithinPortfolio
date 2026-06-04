interface Socials {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
}

export default function SocialSidebar({ socials }: { socials?: Socials }) {
  const s = socials || {};
  return (
    <div className="social-sidebar visible" id="socialSidebar">
      {s.linkedin && (
        <a href={s.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in" />
        </a>
      )}
      {s.github && (
        <a href={s.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <i className="fab fa-github" />
        </a>
      )}
      {s.twitter && (
        <a href={s.twitter} target="_blank" rel="noreferrer" aria-label="Twitter / X">
          <i className="fab fa-x-twitter" />
        </a>
      )}
      {s.instagram && (
        <a href={s.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram" />
        </a>
      )}
    </div>
  );
}
