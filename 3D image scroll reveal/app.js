document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(ScrollTrigger, SplitText);

	const lenis = new Lenis();
	lenis.on('scroll', ScrollTrigger.update);
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000);
	});
	gsap.ticker.lagSmoothing(0);

	gsap.set('.image-motion', {
		transform: 'rotatex(90deg)',
	});

	gsap.to('.image-motion', {
		transform: 'rotatex(0deg)',
		scrollTrigger: {
			trigger: '.section2',
			start: 'top bottom',
			end: 'bottom top',
			scrub: true,
			markers: false,
		},
	});

	gsap.fromTo('.title', {
		opacity: 0,
		y: 50,
	}, {
		opacity: 1,
		y: 0,
		duration: 1,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: '.section3',
			start: 'top 80%',
			end: 'bottom 20%',
			toggleActions: 'play none none reverse',
		},
	});

	gsap.fromTo('.subtitle', {
		opacity: 0,
		y: 30,
	}, {
		opacity: 1,
		y: 0,
		duration: 0.8,
		delay: 0.3,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: '.section3',
			start: 'top 80%',
			end: 'bottom 20%',
			toggleActions: 'play none none reverse',
		},
	});

	const text = new SplitText('.text', {
		types: 'lines',
		mask: 'lines',
	});

	gsap.fromTo(text.lines, {
		opacity: 0,
		y: 30,
	}, {
		opacity: 1,
		y: 0,
		stagger: 0.2,
		duration: 0.8,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: '.text-content',
			start: 'top 80%',
			end: 'bottom 20%',
			toggleActions: 'play none none reverse',
		},
	});

	gsap.fromTo('.feature', {
		opacity: 0,
		y: 50,
		scale: 0.9,
	}, {
		opacity: 1,
		y: 0,
		scale: 1,
		stagger: 0.2,
		duration: 0.8,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: '.features',
			start: 'top 80%',
			end: 'bottom 20%',
			toggleActions: 'play none none reverse',
		},
	});
});