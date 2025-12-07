import React, { createContext, StrictMode, useContext, useEffect, useRef, useState } from "https://esm.sh/react";
import { Fragment } from "https://esm.sh/react/jsx-runtime";
import { createRoot } from "https://esm.sh/react-dom/client";
import { BrowserRouter, Link, Routes, Route } from "https://esm.sh/react-router-dom";

const EarningsContext = createContext<EarningsContextType | undefined>(undefined);
const useEarnings = (): EarningsContextType => {
	const context = useContext(EarningsContext);

	if (!context) {
		throw new Error("useEarnings must be used within Providers!");
	}

	return context;
};

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);
const useGeneral = (): GeneralContextType => {
	const context = useContext(GeneralContext);

	if (!context) {
		throw new Error("useGeneral must be used within Providers!");
	}

	return context;
};

const Providers = ({ children }: ProvidersProps) => {
	const [firstLoad, setFirstLoad] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const modalToggle = () => setModalIsOpen(prev => !prev);
	const modalClose = () => setModalIsOpen(false);
	const [navIsOpen, setNavIsOpen] = useState(false);
	const navToggle = () => setNavIsOpen(prev => !prev);
	const navClose = () => setNavIsOpen(false);
	// earnings (could be fetched from a server but static for this demo)
	const amount = 30;
	const nextPayout = 10550;
	const pointsA = [0, 0.05, 0.05, 0.23, 0.22, 0.35, 0.25, 0.58, 0.54, 0.93, 0.9];
	const pointsB = [0, 0, 0.25, 0.17, 0.21, 0.18, 0.53, 0.83, 0.39, 0.42];
	// values
	const general = { firstLoad, setFirstLoad, modalIsOpen, modalToggle, modalClose, navIsOpen, navToggle, navClose };
	const earnings = { amount, nextPayout, pointsA, pointsB };

	return (
		<GeneralContext.Provider value={general}>
			<EarningsContext.Provider value={earnings}>
				{children}
			</EarningsContext.Provider>
		</GeneralContext.Provider>
	);
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter basename="/">
			<Providers>
				<div className="top">
					<IconSprites />
					<Header />
					<Routes>
						<Route path="*" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/for-business" element={<ForBusiness />} />
						<Route path="/media" element={<Media />} />
						<Route path="/blog" element={<Blog />} />
						<Route path="/terms-of-service" element={<TermsOfService />} />
						<Route path="/privacy-policy" element={<PrivacyPolicy />} />
						// <Route path="*" element={<Error404 />} />
					</Routes>
				</div>
				<Login />
			</Providers>
		</BrowserRouter>
	</StrictMode>
);

// UI components
function AppStoreButton({ href }: AppStoreButtonProps) {
	return (
		<a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--apple">
			<Icon icon="apple" />
			<span className="btn__label-group">
				<small>Download on the</small>
				<span className="btn__label">App Store</span>
			</span>
		</a>
	);
}
function GoogleButton({ href }: GoogleButtonProps) {
	return (
		<a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--google">
			<Icon icon="google" />
			Continue with Google
		</a>
	);
}
function Header() {
	const { navToggle } = useGeneral();

	return (
		<header>
			<Logo />
			<IconButton title="Menu" icon="hamburger" mobileOnly={true} onClick={navToggle} />
			<Nav />
		</header>
	);
}
function Hero({ children }: HeroProps) {
	return (
		<div className="hero">{children}</div>
	);
}
function Icon({ icon }: IconProps) {
	const href = `#${icon}`;

	return (
		<svg className="icon" width="16px" height="16px" aria-hidden="true">
			<use href={href} />
		</svg>
	);
}
function IconButton({ title, icon, mobileOnly, onClick }: IconButtonProps) {
	const buttonClasses = `btn btn--square${mobileOnly ? " btn--mobile" : ""}`;

	return (
		<button className={buttonClasses} type="button" title={title} onClick={onClick}>
			<Icon icon={icon} />
		</button>
	);
}
function IconSprites() {
	return (
		<svg width="0" height="0" display="none">
			<symbol id="amazon" viewBox="0 0 16 16">
				<circle fill="hsl(36, 100%, 50%)" cx="8" cy="8" r="8" />
				<g fill="none" fillRule="evenodd" transform="matrix(0.625, 0, 0, 0.625, 3, 3)">
					<path d="M 8.468 8.653 C 8.22 9.147 7.796 9.465 7.337 9.573 C 7.267 9.573 7.161 9.608 7.055 9.608 C 6.278 9.608 5.819 9.007 5.819 8.124 C 5.819 6.993 6.49 6.464 7.337 6.216 C 7.796 6.11 8.326 6.074 8.856 6.074 L 8.856 6.499 C 8.856 7.311 8.891 7.946 8.468 8.653 Z M 8.856 4.451 C 8.397 4.486 7.866 4.52 7.337 4.59 C 6.525 4.697 5.713 4.839 5.043 5.157 C 3.737 5.687 2.853 6.817 2.853 8.476 C 2.853 10.562 4.195 11.621 5.891 11.621 C 6.455 11.621 6.914 11.549 7.337 11.445 C 8.009 11.232 8.573 10.843 9.244 10.136 C 9.632 10.666 9.739 10.915 10.409 11.48 C 10.586 11.549 10.763 11.549 10.903 11.445 C 11.327 11.091 12.07 10.455 12.457 10.102 C 12.634 9.96 12.599 9.748 12.492 9.573 C 12.104 9.078 11.715 8.653 11.715 7.7 L 11.715 4.52 C 11.715 3.178 11.822 1.942 10.833 1.024 C 10.022 0.283 8.75 0 7.761 0 L 7.337 0 C 5.537 0.104 3.631 0.882 3.206 3.108 C 3.135 3.391 3.348 3.496 3.489 3.531 L 5.467 3.779 C 5.678 3.743 5.785 3.566 5.819 3.391 C 5.995 2.614 6.631 2.225 7.337 2.153 L 7.479 2.153 C 7.903 2.153 8.362 2.33 8.609 2.684 C 8.891 3.108 8.856 3.673 8.856 4.168 L 8.856 4.451 Z" fill="hsl(215, 14%, 24%)" />
					<path d="M 15.998 11.982 L 15.998 11.981 C 15.991 11.815 15.956 11.688 15.886 11.582 L 15.879 11.572 L 15.87 11.561 C 15.8 11.484 15.732 11.455 15.659 11.423 C 15.439 11.338 15.12 11.293 14.737 11.292 C 14.461 11.292 14.157 11.319 13.851 11.385 L 13.85 11.365 L 13.543 11.467 L 13.537 11.47 L 13.363 11.527 L 13.363 11.534 C 13.159 11.619 12.974 11.724 12.802 11.849 C 12.694 11.929 12.606 12.036 12.601 12.199 C 12.598 12.287 12.643 12.389 12.718 12.449 C 12.792 12.509 12.879 12.53 12.955 12.53 C 12.973 12.53 12.99 12.529 13.005 12.526 L 13.02 12.525 L 13.031 12.523 C 13.182 12.491 13.401 12.47 13.658 12.434 C 13.878 12.409 14.111 12.392 14.313 12.392 C 14.456 12.391 14.585 12.401 14.674 12.42 C 14.718 12.429 14.751 12.44 14.769 12.45 C 14.775 12.452 14.78 12.455 14.783 12.456 C 14.786 12.469 14.792 12.501 14.791 12.545 C 14.793 12.714 14.722 13.029 14.623 13.336 C 14.527 13.642 14.41 13.95 14.333 14.154 C 14.314 14.201 14.302 14.253 14.302 14.31 C 14.3 14.392 14.334 14.491 14.405 14.557 C 14.475 14.623 14.565 14.649 14.641 14.649 L 14.644 14.649 C 14.757 14.648 14.853 14.603 14.936 14.538 C 15.717 13.836 15.989 12.714 16 12.083 L 15.998 11.982 Z M 13.683 12.955 C 13.603 12.954 13.521 12.973 13.445 13.009 C 13.359 13.043 13.272 13.082 13.189 13.117 L 13.068 13.168 L 12.91 13.231 L 12.91 13.233 C 11.193 13.929 9.389 14.338 7.721 14.374 C 7.659 14.376 7.597 14.376 7.538 14.376 C 4.913 14.377 2.772 13.16 0.612 11.96 C 0.537 11.92 0.459 11.899 0.384 11.899 C 0.287 11.899 0.187 11.936 0.115 12.004 C 0.042 12.072 -0.001 12.171 0 12.272 C -0.001 12.403 0.07 12.523 0.168 12.601 C 2.196 14.362 4.418 15.998 7.406 16 C 7.465 16 7.524 15.998 7.583 15.997 C 9.484 15.955 11.634 15.312 13.303 14.264 L 13.313 14.257 C 13.532 14.126 13.75 13.977 13.956 13.813 C 14.084 13.718 14.172 13.569 14.172 13.415 C 14.167 13.141 13.934 12.955 13.683 12.955 Z" fill="hsl(0, 0%, 100%)" />
				</g>
            </symbol>
			<symbol id="apple" viewBox="0 0 16 16">
				<path fill="currentcolor" d="M 10.457 2.551 C 11.04 1.875 11.434 0.934 11.326 -0.003 C 10.485 0.029 9.468 0.534 8.866 1.209 C 8.324 1.808 7.852 2.766 7.979 3.684 C 8.917 3.754 9.874 3.228 10.457 2.551 M 12.56 8.496 C 12.583 10.918 14.776 11.724 14.8 11.734 C 14.783 11.791 14.45 12.882 13.645 14.01 C 12.948 14.985 12.226 15.955 11.088 15.976 C 9.97 15.996 9.61 15.341 8.331 15.341 C 7.053 15.341 6.653 15.955 5.595 15.996 C 4.497 16.035 3.659 14.941 2.958 13.97 C 1.522 11.984 0.426 8.356 1.899 5.908 C 2.63 4.694 3.937 3.923 5.355 3.904 C 6.434 3.884 7.452 4.599 8.112 4.599 C 8.771 4.599 10.009 3.739 11.31 3.866 C 11.854 3.887 13.384 4.076 14.364 5.452 C 14.285 5.499 12.54 6.472 12.56 8.496" />
            </symbol>
			<symbol id="caret-right" viewBox="0 0 16 16">
				<polyline fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" points="6 4,10 8,6 12" />
            </symbol>
			<symbol id="close" viewBox="0 0 16 16">
				<g stroke="currentcolor" strokeWidth="1">
					<polyline points="1 1,15 15" />
					<polyline points="1 15,15 1" />
				</g>
			</symbol>
			<symbol id="fake-refresh" viewBox="0 0 32 32">
				<rect fill="var(--gray700)" rx="8" ry="8" width="32" height="32" />
				<path fill="hsl(0, 0%, 100%)" d="M 7.996 0.765 C 7.997 0.316 8.483 0.037 8.871 0.261 C 8.885 0.269 8.899 0.278 8.911 0.286 L 12.356 2.671 C 12.692 2.903 12.692 3.399 12.356 3.63 L 8.911 6.015 C 8.543 6.271 8.035 6.031 7.998 5.584 C 7.997 5.568 7.996 5.553 7.996 5.537 L 7.996 3.734 C 3.808 3.734 1.19 8.269 3.284 11.896 C 5.378 15.524 10.614 15.524 12.708 11.896 C 13.186 11.069 13.437 10.13 13.437 9.175 C 13.437 8.577 14.086 8.203 14.603 8.502 C 14.844 8.641 14.992 8.898 14.992 9.175 C 14.992 14.561 9.162 17.927 4.498 15.234 C -0.166 12.541 -0.166 5.809 4.498 3.116 C 5.561 2.502 6.768 2.179 7.996 2.179 L 7.996 0.765 Z" transform="matrix(0, 1, -1, 0, 24, 8)" />
			</symbol>
			<symbol id="google" viewBox="0 0 16 16">
				<path fill="currentcolor" d="M 8.311 7.279 L 8.311 9.464 L 13.535 9.464 C 13.449 10.533 13.012 11.486 12.341 12.222 L 12.344 12.218 C 11.372 13.208 10.021 13.822 8.526 13.822 C 8.45 13.822 8.375 13.82 8.3 13.817 L 8.311 13.817 C 5.145 13.816 2.58 11.25 2.58 8.084 C 2.58 8.056 2.58 8.029 2.58 8.003 L 2.58 8.007 C 2.58 7.984 2.58 7.957 2.58 7.93 C 2.58 4.764 5.145 2.198 8.311 2.196 C 8.332 2.196 8.357 2.196 8.383 2.196 C 9.885 2.196 11.248 2.792 12.249 3.761 L 12.247 3.76 L 13.785 2.222 C 12.417 0.85 10.526 0 8.436 0 C 8.392 0 8.349 0.001 8.305 0.001 L 8.311 0.001 C 8.31 0.001 8.309 0.001 8.307 0.001 C 3.869 0.001 0.263 3.567 0.2 7.991 L 0.2 7.997 C 0.263 12.427 3.869 15.994 8.307 15.994 C 8.309 15.994 8.31 15.994 8.312 15.994 C 8.402 15.997 8.507 16 8.613 16 C 10.685 16 12.556 15.14 13.889 13.757 L 13.891 13.755 C 15.067 12.473 15.787 10.758 15.787 8.874 C 15.787 8.794 15.786 8.714 15.783 8.635 L 15.784 8.646 C 15.784 8.618 15.784 8.583 15.784 8.549 C 15.784 8.1 15.742 7.66 15.661 7.234 L 15.668 7.278 L 8.311 7.279 Z" />
			</symbol>
			<symbol id="hamburger" viewBox="0 0 32 32">
				<g fill="none" stroke="currentcolor" strokeWidth="4">
					<polyline points="0 2,32 2" />
					<polyline points="0 10,32 10" />
				</g>
				<text fill="currentcolor" fontSize={11} textAnchor="middle" x="16" y="29">Menu</text>
			</symbol>
			<symbol id="lock" viewBox="0 0 24 24">
				<path fillRule="evenodd" clipRule="evenodd" d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8ZM14 16C14 17.1046 13.1046 18 12 18C10.8954 18 10 17.1046 10 16C10 14.8954 10.8954 14 12 14C13.1046 14 14 14.8954 14 16Z" fill="currentcolor" />
            </symbol>
			<symbol id="logo" viewBox="0 0 16 16">
				<g fill="currentcolor">
					<path d="M 8.933 0.206 C 8.933 0.206 8.404 0.14 7.973 0.631 C 7.534 1.131 7.449 2.12 7.377 2.586 L 6.493 8.186 C 6.446 8.652 6.758 9.013 7.087 9.286 C 7.364 9.516 7.68 9.585 8.147 9.585 L 11.413 9.585 C 11.879 9.585 12.115 9.537 12.448 9.338 C 12.744 9.162 13.023 8.675 13.023 8.675 C 13.237 8.282 15.08 3.234 15.08 3.234 C 15.251 2.798 15.598 1.771 15.381 1.138 C 15.237 0.717 14.863 0.275 14.396 0.244 C 9.2 0.2 8.933 0.206 8.933 0.206 Z" />
					<path d="M 1.684 5.619 C 1.684 5.619 0.743 5.593 0.607 6.839 L 0.453 10.567 C 0.437 11.033 0.541 11.28 0.949 11.621 C 1.244 11.868 2.006 11.887 2.006 11.887 C 2.006 11.887 3.308 11.917 3.705 11.875 C 4.237 11.819 4.749 11.195 4.827 10.729 L 5.33 7.486 C 5.408 7.019 5.53 6.371 5.144 6.029 C 4.624 5.568 4.244 5.619 3.777 5.619 L 1.684 5.619 Z" />
					<path d="M 5.803 12.534 L 5.479 14.571 C 5.387 15.295 5.877 15.69 6.343 15.768 L 7.796 15.78 C 8.317 15.766 8.608 15.606 8.825 15.081 L 9.803 12.392 C 10.029 11.565 9.819 11.182 9.023 11.152 C 9.023 11.152 7.874 11.102 7.029 11.126 C 5.952 11.156 5.803 12.534 5.803 12.534 Z" />
				</g>
			</symbol>
			<symbol id="netflix" viewBox="0 0 16 16">
				<circle fill="hsl(0, 0%, 0%)" cx="8" cy="8" r="8" />
				<g fill="hsl(357, 93%, 36%)">
					<path d="M 8.79 3.01 L 8.79 5.22 L 8.79 7.42 L 8.61 6.91 L 8.37 11.83 C 8.6 12.48 8.72 12.83 8.72 12.84 C 8.72 12.84 8.86 12.84 9.02 12.85 C 9.5 12.87 10.09 12.92 10.55 12.98 C 10.65 13 10.74 13 10.75 13 C 10.75 12.99 10.76 10.74 10.75 8 L 10.75 3.01 L 8.79 3.01 Z" />
					<path d="M 5.25 3 L 5.25 8 C 5.25 10.74 5.25 12.99 5.26 13 C 5.26 13 5.43 12.98 5.64 12.96 C 5.84 12.94 6.12 12.91 6.26 12.9 C 6.48 12.88 7.12 12.84 7.2 12.84 C 7.23 12.84 7.23 12.73 7.23 10.72 L 7.23 8.6 L 7.39 9.05 C 7.41 9.12 7.42 9.14 7.44 9.21 L 7.67 4.29 C 7.63 4.15 7.66 4.22 7.6 4.06 C 7.41 3.52 7.24 3.06 7.24 3.04 L 7.23 3 L 5.25 3 Z" />
				</g>
				<path fill="hsl(357, 92%, 47%)" d="M 5.25 3 L 7.23 8.61 L 7.23 8.6 L 7.39 9.05 C 8.26 11.51 8.72 12.83 8.72 12.84 C 8.72 12.84 8.86 12.84 9.02 12.85 C 9.5 12.87 10.09 12.92 10.55 12.98 C 10.65 13 10.74 13 10.75 13 L 8.79 7.42 L 8.61 6.91 C 8.42 6.41 8.31 6.07 7.59 4.06 C 7.4 3.52 7.24 3.06 7.23 3.04 L 7.22 3 L 6.24 3 L 5.25 3 Z" />
			</symbol>
			<symbol id="spotify" viewBox="0 0 48 48">
				<circle fill="hsl(0, 0%, 0%)" cx="24" cy="24" r="22" />
				<path fill="hsl(145, 100%, 43%)" d="M 38.16 21.36 C 30.48 16.8 17.64 16.32 10.32 18.6 C 9.12 18.96 7.92 18.24 7.56 17.16 C 7.2 15.96 7.92 14.76 9 14.4 C 17.52 11.88 31.56 12.36 40.44 17.64 C 41.52 18.24 41.88 19.68 41.28 20.76 C 40.68 21.6 39.24 21.96 38.16 21.36 M 37.92 28.08 C 37.32 28.92 36.24 29.28 35.4 28.68 C 28.92 24.72 19.08 23.52 11.52 25.92 C 10.56 26.16 9.48 25.68 9.24 24.72 C 9 23.76 9.48 22.68 10.44 22.44 C 19.2 19.8 30 21.12 37.44 25.68 C 38.16 26.04 38.52 27.24 37.92 28.08 M 35.04 34.68 C 34.56 35.4 33.72 35.64 33 35.16 C 27.36 31.68 20.28 30.96 11.88 32.88 C 11.04 33.12 10.32 32.52 10.08 31.8 C 9.84 30.96 10.44 30.24 11.16 30 C 20.28 27.96 28.2 28.8 34.44 32.64 C 35.28 33 35.4 33.96 35.04 34.68 M 24 0 C 10.8 0 0 10.8 0 24 C 0 37.2 10.8 48 24 48 C 37.2 48 48 37.2 48 24 C 48 10.8 37.32 0 24 0" />
            </symbol>
			<symbol id="uber" viewBox="0 0 192 192">
				<circle fill="hsl(0, 0% ,0%)" cx="96" cy="96" r="96" />
				<g fill="none" stroke="hsl(0, 0%, 100%)" strokeLinecap="round" strokeWidth="8">
					<path d="M54.24 119.13v-32.9m13.84 32.9V72.87" />
					<circle cx="84.53" cy="102.68" r="16.45" />
					<path d="M160.22 119.13V87.99m11.78 0h0c-1.9 0-3.77.45-5.45 1.32-2.73 1.42-6.33 3.97-6.33 7.51" />
					<g strokeLinejoin="round">
						<path d="M20 72.87v31.73c.77 8.11 8.14 14.41 16.88 14.52 8.91.12 16.58-6.25 17.36-14.52V72.87" />
						<path d="M142.57 113.99c-3 3.17-7.24 5.14-11.95 5.14-9.09 0-16.45-7.37-16.45-16.45s7.37-16.45 16.45-16.45 16.45 7.37 16.45 16.45h-32.9" />
					</g>
				</g>
            </symbol>
		</svg>
	);
}
function Locks() {
	const shapes: LocksShape[] = [
		"dot",
		"line",
		"dot-lg",
		"line",
		"lock",
		"line",
		"dot-lg",
		"line",
		"dot"
	];
	const shapeElements = {
		dot: <div className="locks__dot"></div>,
		"dot-lg": <div className="locks__dot locks__dot--lg"></div>,
		line: <div className="locks__line"></div>,
		lock: <div className="locks__center-dot"><Icon icon="lock" /></div>
	};

	return (
		<div className="locks">
			{shapes.map((shape, i) => (
				<Fragment key={i}>{shapeElements[shape]}</Fragment>
			))}
		</div>
	);
}
function Login() {
	const { modalIsOpen, modalClose } = useGeneral();
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [modalClass, setModalClass] = useState("modal");
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");
	const closeDuration = 300

	/**
	 * Log in using the provided email and password.
	 * @param e Form submission event
	 */
	function submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log("Logged in!");
		// normal login code would appear here
	}
	/**
	 * Keep the focused element inside the modal.
	 * @param e Keyboard event
	 * @param firstElement First tabbable element
	 * @param lastElement Last tabbable element
	 */
	function trapFocus(e: KeyboardEvent, firstElement: HTMLElement, lastElement: HTMLElement) {
		const isTabPressed = e.key === "Tab";

		if (!isTabPressed) return;

		if (e.shiftKey) {
			tabBackward(e, firstElement, lastElement);
		} else {
			tabForward(e, firstElement, lastElement);
		}
	}
	/**
	 * Go to the previous tabbable element.
	 * @param e Keyboard event
	 * @param firstElement First tabbable element
	 * @param lastElement Last tabbable element
	 */
	function tabBackward(e: KeyboardEvent, firstElement: HTMLElement, lastElement: HTMLElement) {
		if (document.activeElement === firstElement) {
			e.preventDefault();
			lastElement.focus();
		}
	}
	/**
	 * Go to the next tabbable element.
	 * @param e Keyboard event
	 * @param firstElement First tabbable element
	 * @param lastElement Last tabbable element
	 */
	function tabForward(e: KeyboardEvent, firstElement: HTMLElement, lastElement: HTMLElement) {
		if (document.activeElement === lastElement) {
			e.preventDefault();
			firstElement.focus();
		}
	}
	// handle closing transitions
	useEffect(() => {
		if (modalIsOpen) {
			setModalClass("modal open");

		} else if (modalClass === "modal open") {
			// switch the class only if `open` is used
			setModalClass("modal closing");

			const timeout = setTimeout(() => {
				setModalClass("modal");
			}, closeDuration);

			return () => clearTimeout(timeout);
		}
	}, [modalIsOpen]);
	// close on Esc
	useEffect(() => {
		if (!modalIsOpen) return;

		const focusableSelectors = [
			"a[href]",
			"button:not([disabled])",
			"textarea:not([disabled])",
			"input:not([type='hidden']):not([disabled])",
			"select:not([disabled])",
			"[tabindex]:not([tabindex='-1'])"
		];

		const modal = modalRef.current;
		const focusableElements = modal?.querySelectorAll<HTMLElement>(focusableSelectors.join(","));
		const focusableArray = focusableElements ? Array.from(focusableElements) : [];
		const firstElement = focusableArray[0];
		const lastElement = focusableArray[focusableArray.length - 1];

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				modalClose();
			}
			if (firstElement && lastElement) {
				trapFocus(e, firstElement, lastElement);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [modalIsOpen, modalClose]);

	return (
		<>
			<div ref={modalRef} className={modalClass} aria-modal="true" role="dialog" aria-labelledby="modal-title">
				<form className="modal__form" method="post" noValidate onSubmit={submit}>
					<h2 id="modal-title" className="modal__title">
						<Icon icon="logo" />
						Create your account
					</h2>
					<GoogleButton href="#" />
					<hr />
					<TextField
						id="email"
						label="Your email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextField
						id="pass"
						label="Create a password"
						type="password"
						value={pass}
						onChange={(e) => setPass(e.target.value)}
					/>
					<button className="btn btn--submit" type="submit">Continue with email</button>
					<p className="modal__note">
						<Link to="/" onClick={modalClose}>Aleady have an account?</Link>
					</p>
				</form>
				<p className="modal__note">
					By signing up, you agree to the <Link to="/terms-of-service" onClick={modalClose}>Terms of Service</Link> and <Link to="/privacy-policy" onClick={modalClose}>Privacy Policy</Link>
				</p>
			</div>
			<div className="backdrop" onClick={modalClose}></div>
		</>
	);
}
function Logo() {
	return (
		<Link className="logo" to="/">
			<Icon icon="logo" />
			earnwave
		</Link>
	);
}
function Nav() {
	const { modalToggle, navIsOpen, navClose } = useGeneral();
	const [navClass, setNavClass] = useState<string | undefined>(undefined);
	const breakPoint = 768;
	const closeDuration = 300;
	const routes: NavItem[] = [
		{ href: "/about", text: "About" },
		{ href: "/for-business", text: "For business" },
		{ href: "/media", text: "Media" },
		{ href: "/blog", text: "Blog" }
	];
	/** Open the account creation modal while closing the navigation menu. */
	function signUpOpenModal() {
		modalToggle();
		navClose();
	}
	// handle closing transitions
	useEffect(() => {
		if (navIsOpen) {
			setNavClass("open");

		} else if (navClass === "open") {
			// switch the class only if `open` is used
			setNavClass("closing");

			const timeout = setTimeout(() => {
				setNavClass(undefined);
			}, closeDuration);

			return () => clearTimeout(timeout);
		}
	}, [navIsOpen]);
	// close on Esc or resize
	useEffect(() => {
		if (!navIsOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				navClose();
			}
		};
		const handleResize = () => {
			if (window.innerWidth >= breakPoint) {
				navClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
    	window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("resize", handleResize);
		};
	}, [navIsOpen, navClose]);

	return (
		<>
			<nav className={navClass}>
				<div className="btn-block">
					<IconButton title="Close" icon="close" mobileOnly={true} onClick={navClose} />
				</div>
				<ul>
					{routes.map((route, i) => (
						<li key={i}>
							<Link to={route.href} onClick={navClose}>{route.text}</Link>
						</li>
					))}
				</ul>
				<div className="btn-block">
					<button className="btn" type="button" onClick={signUpOpenModal}>Sign up</button>
				</div>
			</nav>
			<div className="backdrop" onClick={navClose}></div>
		</>
	);
}
function QuestionTags({ questions }: QuestionTagsProps) {
	/**
	 * Split a question into chunks to use in the tags.
	 * @param question Question text
	 * @param n Number of chunks
	 */
	function questionToChunks(question: string, n: number) {
		const words = question.split(' ');
		const chunks = [];
		let currentChunk = "";

		for (const word of words) {
			// check if adding the next word exceeds the limit
			if (currentChunk.length + word.length + 1 > n) {
				// push the current chunk to the array and reset it
				chunks.push(currentChunk.trim());
				// start a new chunk with the current word
				currentChunk = word;
			} else {
				// add the word to the current chunk
				currentChunk += (currentChunk ? " " : "") + word;
			}
		}
		// push any remaining chunk
		if (currentChunk) {
			chunks.push(currentChunk.trim());
		}

		return chunks;
	}

	const ariaLabel = questions.join(" ");
	const charsPerLine = 22;
	// show only the first 3 questions
	const tagConfig: QuestionTagConfig[] = [
		{
			fill: "light-dark(var(--gray100), var(--gray700))",
			d: "M 29 26 C 25.653 23.601 18.93 15.708 16.35 18.477 C 13.129 21.935 16.102 27.554 15.404 31.249 C 14.3 37.095 3.39 31.262 5.944 35.269 C 8.062 38.591 9.416 39.006 9.019 43.311 C 8.447 49.519 -10.687 57.996 12.33 59.865"
		},
		{
			fill: "light-dark(var(--gray150), var(--gray650))",
			d: "M 29.017 25.818 C 30.375 23.951 32.562 14.802 35.641 15.175 C 38.47 15.517 34.727 32.15 39.659 38.824 C 43.782 44.403 57.097 45.277 65 38.5"
		},
		{
			fill: "light-dark(var(--gray200), var(--gray600))",
			d: "M 29 26 C 27.518 11.629 28.743 1.957 35.4 1 C 41.297 0.618 41.868 7.332 47.5 8 C 56.814 7.918 60.666 2.891 70 3 C 75.133 3.06 77.909 5.467 80 10"
		}
	];
	const questionsSplit: QuestionTagConfig[] = questions.slice(0,3).map((question, i) => ({
		questionText: questionToChunks(question, charsPerLine),
		...tagConfig[i]
	}));
	const textFill = "light-dark(var(--gray800), var(--gray200))";
	const tagStartX = 27;
	const tagStartY = 85;
	const tagIncX = 22;
	const tagIncY = -35;
	const fontSize = 6.5;
	const textStartY = 36;
	const textIncY = fontSize * 1.5;

	return (
		<svg role="img" aria-label={ariaLabel} className="question-tags" viewBox="0 0 170 140" width="170px" height="140px">
			<defs>
				<linearGradient id="tag-gradient1" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
					<stop offset="95%" stopColor="hsl(0, 0%, 0%)" />
				</linearGradient>
				<linearGradient id="tag-gradient2" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
					<stop offset="60%" stopColor="hsl(0, 0%, 0%)" />
				</linearGradient>
				<linearGradient id="tag-gradient3" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
					<stop offset="75%" stopColor="hsl(0, 0%, 0%)" />
				</linearGradient>
				<mask id="tag-mask1">
					<rect x="-17" y="-14" width="115" height="70" fill="url(#tag-gradient1)" />
				</mask>
				<mask id="tag-mask2">
					<rect x="-17" y="-14" width="115" height="70" fill="url(#tag-gradient2)" />
				</mask>
				<mask id="tag-mask3">
					<rect x="-17" y="-14" width="115" height="70" fill="url(#tag-gradient3)" />
				</mask>
			</defs>
			{
				questionsSplit.map((question, i) => {
					const x = tagStartX + tagIncX * i;
					const y = tagStartY + tagIncY * i;
					const translate = `translate(${x}, ${y})`;
					const mask = `url(#tag-mask${i + 1})`;
					const { fill, d, questionText } = question;

					return (
						<g key={i}>
							<g className="question-tags__tag">
								<g transform={translate}>
									<path fill={fill} d="M 10 0 L 88 0 C 93.523 0 98 4.477 98 10 L 98 46 C 98 51.523 93.523 56 88 56 L 10 56 C 4.477 56 0 51.523 0 46 L 0 10 C 0 4.477 4.477 0 10 0 Z M 12 9 C 10.343 9 9 10.343 9 12 C 9 13.657 10.343 15 12 15 C 13.657 15 15 13.657 15 12 C 15 10.343 13.657 9 12 9 Z" />
									<g mask={mask}>
										<path fill="none" stroke="currentcolor" d={d} transform="translate(-17, -14)" />
									</g>
									{
										questionText?.map((segment, j) => {
											const textY = textStartY + textIncY * j;

											return (
												<text key={j} fill={textFill} y={textY} fontSize={fontSize} transform="translate(9,0)">{segment}</text>
											)
										})
									}
								</g>
							</g>
						</g>
					)
				})
			}
		</svg>
	);
}
function SourceIcons() {
	const sources: ConnectionSource[] = [
		{ name: "Spotify", icon: "spotify", position: "front" },
		{ name: "Uber", icon: "uber", position: "back" },
		{ name: "Amazon", icon: "amazon", position: "back" },
		{ name: "Netflix", icon: "netflix", position: "front" }
	];

	return (
		<div className="source-icons">
			{sources.map((source, i) => {
				const { name, icon, position } = source;
				const sourceClass = `source-icon source-icon--${position}`
				return (
					<div key={i} className={sourceClass} role="img" aria-label={name}>
						<Icon icon={icon} />
					</div>
				)
			})}
		</div>
	);
}
function Switch({ label, checked, onChange }: SwitchProps) {
	return (
		<label className="switch">
			<span className="switch__sr-text">{label}</span>
			<input
				className="switch__input"
				role="switch"
				type="checkbox"
				checked={checked}
				onChange={onChange}
			/>
		</label>
	);
}
function TextField({ id, label, type, value, onChange }: TextFieldProps){
	return (
		<div className="form-field">
			<label htmlFor={id}>{label}</label>
			<input id={id} type={type} value={value} autoComplete="off" onChange={onChange} />
		</div>
	);
}
function Widget({ centered, children }: WidgetProps) {
	const [entering, setEntering] = useState(true);
	const enterTimeout = 3000;
	const widgetClass = [
		"widget",
		entering && "widget--entering",
		centered && "widget--centered"
	].filter(Boolean).join(" ");
	// ensures animations don’t rerun when the min-width media query is triggered
	useEffect(() => {
		if (!entering) return;

		const timeout = setTimeout(() => {
			setEntering(false);
		}, enterTimeout);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<div className={widgetClass}>{children}</div>
	);
}
function WidgetCircles() {
	const circles = 3;
	const circleArray: React.ReactNode[] = [];

	for (let c = 1; c <= circles; ++c) {
		const circleClass = `widget__circle widget__circle--ts widget__circle--ts${c}`;
		circleArray.push(<div key={c} className={circleClass}></div>);
	}

	return circleArray;
}
function WidgetCirclesWithRays() {
	const circles = 3;
	const rays = 8;
	const circleArray: React.ReactNode[] = [];
	const rayArray: React.ReactNode[] = [];

	for (let c = 1; c <= circles; ++c) {
		const circleClass = `widget__circle widget__circle--bc widget__circle--bc${c}`;
		circleArray.push(<div key={c} className={circleClass}></div>);
	}
	for (let r = 0; r < rays; ++r) {
		rayArray.push(<div key={r} className="widget__ray"></div>);
	}

	return (
		<div className="widget__circle-wrap">
			{rayArray}
			{circleArray}
		</div>
	);
}
function WidgetGraph({ ariaLabel, pointsA, pointsB }: WidgetGraphProps) {
	// graph container
	const graphMargin = 2;
	const graphWidth = 160;
	const graphHeight = 120;
	const graphWidthAdjusted = graphWidth - graphMargin * 2;
	const graphHeightAdjusted = graphHeight - graphMargin * 2;
	const graphWidthPx = `${graphWidth}px`;
	const graphHeightPx = `${graphHeight}px`;
	const graphTranslate = `translate(${graphMargin},${graphMargin})`;
	const viewBox = `0 0 ${graphWidth} ${graphHeight}`;
	// graph lines
	const pointsAToString = pointsToString(pointsA);
	const pointsBToString = pointsToString(pointsB);

	/**
	 * Convert an array of points into a string to use for SVG polylines.
	 * @param points Point array
	 */
	function pointsToString(points: number[]) {
		return points.map((point, i) => {
			const x = i / (points.length - 1) * graphWidthAdjusted;
			const y = graphHeightAdjusted - point * graphHeightAdjusted;
			return `${x} ${y}`;
		}).join(",");
	}

	return (
		<svg role="img" aria-label={ariaLabel} className="widget__graph" viewBox={viewBox} width={graphWidthPx} height={graphHeightPx}>
			<g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} transform={graphTranslate}>
				<polyline points={pointsBToString} opacity={0.1} />
				<polyline points={pointsAToString} />
			</g>
		</svg>
	);
}
function Widgets() {
	return (
		<div className="widgets">
			<Earnings />
			<Sources />
			<LearnMore />
		</div>
	);
}

// widgets
function Earnings() {
	const { amount, nextPayout, pointsA, pointsB } = useEarnings();
	const LOCALE = "en-US";
	const amountFormatted = new Intl.NumberFormat(LOCALE, {
		style: "currency",
		currency: "USD"
	}).format(amount);
	const nextPayoutFormatted = new Intl.NumberFormat(LOCALE).format(nextPayout);

	return (
		<Widget>
			<div className="widget__badge">Your earnings</div>
			<div className="widget__amount widget__amount--lg">
				{amountFormatted}
			</div>
			<div className="widget__label">Next payout in:</div>
			<div className="widget__amount">
				{nextPayoutFormatted} pts
			</div>
			<WidgetGraph
				ariaLabel="Earnings graph with two lines showing a positive trend"
				pointsA={pointsA}
				pointsB={pointsB}
			/>
		</Widget>
	);
}
function LearnMore() {
	const questions = [
		"How much money have I saved on discounts?",
		"Where do I mostly shop during the winter?",
		"Any products I should be interested in?"
	];

	return (
		<Widget>
			<div className="widget__graphic-wrap">
				<div className="widget__fake-icon">
					<Icon icon="fake-refresh" />
				</div>
				<WidgetCircles />
				<QuestionTags questions={questions} />
			</div>
			<div className="widget__actions">
				<p>Learn more from your data and make better decisions</p>
				<IconButton title="Learn more" icon="caret-right"  />
			</div>
		</Widget>
	);
}
function Sources() {
	const [connecting, setConnecting] = useState(true);

	return (
		<Widget centered={true}>
			<WidgetCirclesWithRays />
			<h2 className="widget__title">Connect sources</h2>
			<Switch
				label="Connect"
				checked={connecting}
				onChange={(e) => setConnecting(e.target.checked)}
			/>
			<SourceIcons />
			<AppStoreButton href="#" />
		</Widget>
	);
}

// pages
function About() {
	return (
		<main>
			<article>
				<Hero>
					<h1>About</h1>
					<p>Effort made was a lot we need to aspirationalise our offerings.</p>
				</Hero>
				<section>
					<h2>Office Ipsum</h2>
					<p>What’s the status on the deliverables for eow? High turnaround rate flesh that out, or back-end of third quarter thought shower eat our own dog food.</p>
					<p>Effort made was a lot high performance keywords, can you slack it to me?, but rehydrate the team, but that’s mint, well done. Marketing computer development html roi feedback team website take five, punch the tree, and come back in here with a clear head, nor deliverables incentivization.</p>
					<p>Peel the onion your work on this project has been really impactful, UX, single wringable neck, yet close the loop, yet focus on the customer journey, yet bells and whistles. This is not a video game, this is a meeting!</p>
				</section>
			</article>
		</main>
	);
}
function Blog() {
	return (
		<main>
			<article>
				<Hero>
					<h1>Blog</h1>
					<p>We need to leverage our synergies shelfware.</p>
				</Hero>
				<section>
					<h2>Office Ipsum</h2>
					<p>Time to open the kimono clear blue water the right info at the right time to the right people, and prairie dogging. Drop-dead date we need to harvest synergy effects. 60% to 30% is a lot of persent throughput, or problem territories service as core &innovations as power makes our brand. Looks great, can we try it a different way tiger team.</p>
					<p>Fast track can you run this by clearance? Hot johnny coming through put it on the parking lot, or through the lens of, and collaboration through advanced technlogy, so we need a recap by eod, cob or whatever comes first horsehead offer.</p>
					<p>Encourage & support business growth put a record on and see who dances, and ensure to follow requirements when developing solutions, so service as core &innovations as power makes our brand, and circle back clear blue water unlock meaningful moments of relaxation.</p>
				</section>
			</article>
		</main>
	);
}
function Error404() {
	return (
		<main>
			<article>
				<Hero>
					<h1>Whoops!</h1>
					<p>That page could not be found.</p>
				</Hero>
				<section>
					<Link className="btn" to="/">Go back home</Link>
				</section>
			</article>
		</main>
	);
}
function ForBusiness() {
	return (
		<main>
			<article>
				<Hero>
					<h1>For business</h1>
					<p>Out of the loop teams were able to drive adoption and awareness.</p>
				</Hero>
				<section>
					<h2>Office Ipsum</h2>
					<p>Roll back strategy not a hill to die on, and currying favour my supervisor didn’t like the latest revision you gave me can you switch back to the first revision?, so i’m sorry I replied to your emails after only three weeks, but can the site go live tomorrow anyway?</p>
					<p>No scraps hit the floor we need to think big start small and scale fast to energize our clients, but let’s unpack that later can we jump on a zoom finance pig in a python, yet bleeding edge. Let’s circle back to that who’s the goto on this job with the way forward , for are we in agreeance, so can you slack it to me?</p>
					<p>Yet closing these latest prospects is like putting socks on an octopus, or build on a culture of contribution and inclusion cloud native container based. Do I have consent to record this meeting. UI we need a recap by eod, cob or whatever comes first. Re-inventing the wheel.</p>
				</section>
			</article>
		</main>
	);
}
function Home() {
	const { firstLoad, setFirstLoad } = useGeneral();
	const [shouldDelay, setShouldDelay] = useState(false);
	const mainClass = shouldDelay ? "first-load" : undefined;

	useEffect(() => {
		if (!firstLoad) {
			setFirstLoad(true);
			setShouldDelay(true);
		}
	}, [firstLoad, setFirstLoad]);

	return (
		<main className={mainClass}>
			<article>
				<Hero>
					<h1>Connect. Learn. Earn.</h1>
					<p>Your data is a profitable asset. With Earnwave you control what data to share anonymously and earn from it.</p>
					<Locks />
				</Hero>
			</article>
			<Widgets />
		</main>
	);
}
function Media() {
	return (
		<main>
			<article>
				<Hero>
					<h1>Media</h1>
					<p>Out of scope synergestic actionables we've bootstrapped the model.</p>
				</Hero>
				<section>
					<h2>Office Ipsum</h2>
					<p>Upsell goalposts, clear blue water, but canatics exploratory investigation data masking, for if you’re not hurting you’re not winning. We want to see more charts. We need to think big start small and scale fast to energize our clients future-proof. Locked and loaded window-licker.</p>
					<p>Downselect sorry I didn’t get your email, or we need evergreen content three-martini lunch, yet we need to make the new version clean and sexy what about scaling components to a global audience?, yet push back. Get six alpha pups in here for a focus group get buy-in.</p>
					<p>Net net through the lens of, for drive awareness to increase engagement those options are already baked in with this model we need to button up our approach.</p>
				</section>
			</article>
		</main>
	);
}
function PrivacyPolicy() {
	return (
		<main>
			<article>
				<Hero>
					<h1>Privacy Policy</h1>
					<p>You’re data isn’t for sale.</p>
				</Hero>
				<section>
					<h2>Section 1</h2>
					<p>Quantity quantity, but time vampire if you want to motivate these clowns, try less carrot and more stick high turnaround rate, and curate put it on the parking lot. Where the metal hits the meat product management breakout fastworks, yet we need more paper, so push back, so run it up the flagpole, yet quick-win.</p>
					<h2>Section 2</h2>
					<p>Can you put it into a banner that is not alarming, but eye catching and not too giant drink the Kool-aid. Those options are already baked in with this model I have a hard stop in an hour and half, nor currying favour fast track no scraps hit the floor</p>
				</section>
			</article>
		</main>
	);
}
function TermsOfService() {
	return (
		<main>
			<article>
				<Hero>
					<h1>Terms of Service</h1>
					<p>Ah yes, the boring stuff nobody wants to read.</p>
				</Hero>
				<section>
					<h2>Section 1</h2>
					<p>They have downloaded gmail and seems to be working for now this vendor is incompetent fire up your browser. 360 degree content marketing pool three-martini lunch, yet (let's not try to) boil the ocean (here/there/everywhere) quick win, nor blue sky thinking, so i need to pee and then go to another meeting.</p>
					<h2>Section 2</h2>
					<p>We’re starting to formalize flexible opinions around our foundations. Strategic staircase a set of certitudes based on deductions founded on false premise, or core competencies work, yet we need to aspirationalise our offerings, or get in the driver's seat. Table the discussion we just need to put these last issues to bed.</p>
				</section>
			</article>
		</main>
	);
}

// types
type AppStoreButtonProps = {
    href: string;
};
type ConnectionSource = {
    name: string;
    icon: string;
    position: string;
};
type EarningsContextType = {
    amount: number;
    nextPayout: number;
    pointsA: number[];
    pointsB: number[];
};
type GeneralContextType = {
    firstLoad: boolean;
    setFirstLoad: (value: boolean) => void;
    modalIsOpen: boolean;
    modalToggle: () => void;
    modalClose: () => void;
    navIsOpen: boolean;
    navToggle: () => void;
    navClose: () => void;
};
type GoogleButtonProps = {
    href: string;
};
type HeroProps = {
    children?: React.ReactNode;
};
type IconProps = {
    icon: string;
};
type IconButtonProps = {
    title: string;
    icon: string;
    mobileOnly?: boolean;
    onClick?: () => void;
};
type LocksShape = "dot" | "dot-lg" | "line" | "lock";
type NavItem = {
    href: string;
    text: string;
};
type ProvidersProps = {
    children?: React.ReactNode;
};
type QuestionTagsProps = {
    questions: string[];
};
type QuestionTagConfig = {
    questionText?: string[];
    fill?: string;
    d?: string;
};
type SwitchProps = {
    label: string;
    checked: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
};
type TextFieldProps = {
    id: string;
    label: string;
    type: TextFieldType;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
};
type TextFieldType = "text" | "email" | "password";
type WidgetProps = {
    centered?: boolean;
    children?: React.ReactNode;
};
type WidgetGraphProps = {
    ariaLabel: string;
    pointsA: number[];
    pointsB: number[];
};