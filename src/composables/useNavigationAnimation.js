import { createAnimation } from "@ionic/vue"


export default function (baseEl, opts){
    console.log('Animating page transition...')

    const { enteringEl, leavingEl } = opts;
    const rootTransition = createAnimation('root-transition');

    const leave = () => createAnimation()
        .addElement(leavingEl)
        .duration(opts.duration || 280)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .fromTo('transform', `translate(0, 0)`, `translate(-100%, 0)`)
        .fromTo('opacity', 0.01, 1);

    const enter = (el) => createAnimation()
        .addElement(el)
        .duration(opts.duration || 280)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .fromTo('transform', `translate(100%, 0)`, `translate(0, 0)`)
        .fromTo('opacity', 0.01, 1);

    rootTransition
        .addAnimation(leave(leavingEl))
        .addAnimation(enter(enteringEl))

    return rootTransition
        .duration(300)
        .easing('ease-in-out');
}