import Link from 'next/link';
import { FC } from 'react';
import { Mail } from 'lucide-react';
import { FaGithub, FaSlack } from 'react-icons/fa6';

const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 font-pop text-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logos & Copyright */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="https://elixir-cloud.dcc.sib.swiss/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <img
              src="ELIXIR On-Cloud Logo Pack/On-Cloud_LockUp.png"
              alt="elixir-cloud-aai-logo"
              className="h-12 md:h-12 w-auto object-contain"
            />
          </a>
          <span className="text-xs text-gray-400 hidden lg:inline">
            © 2026 ELIXIR Cloud AAI • MIT License
          </span>
        </div>

        {/* Center: Navigation Links (Horizontal) */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium">
          <Link href="/overview" className="hover:text-white transition-colors">
            Overview
          </Link>
          <Link
            href="/contributors"
            className="hover:text-white transition-colors"
          >
            Contributors
          </Link>
          <Link href="/partners" className="hover:text-white transition-colors">
            Partners
          </Link>
          <Link href="/funding" className="hover:text-white transition-colors">
            Funding
          </Link>
        </div>

        {/* Right: Social Icons & Website Source ("We got nothing to hide") */}
        <div className="flex items-center gap-4 text-gray-400">
          <a
            href="mailto:cloud-service@elixir-europe.org"
            title="Email Us"
            className="hover:text-white transition-colors p-1"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href="https://join.slack.com/t/elixir-cloud/shared_invite/zt-1uvebyx1e-NcC0Hof2guT9df~haBdQaw"
            target="_blank"
            rel="noopener noreferrer"
            title="Join Slack"
            className="hover:text-white transition-colors p-1"
          >
            <FaSlack className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/elixir-cloud-aai/"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Organization"
            className="hover:text-white transition-colors p-1"
          >
            <FaGithub className="h-4 w-4" />
          </a>

          {/* Website Source Code Link */}
          <a
            href="https://github.com/elixir-cloud-aai/elixir-cloud-aai.github.io"
            target="_blank"
            rel="noopener noreferrer"
            title="We got nothing to hide"
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 border-l border-gray-700 pl-4"
          >
            <FaGithub className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Source Code</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
