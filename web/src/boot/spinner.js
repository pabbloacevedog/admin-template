import {
    Loading,
    QSpinnerBars,
    QSpinnerPie,
    QSpinnerBall,
    QSpinnerPuff,
} from 'quasar'

// customizable (all props available)
Loading.setDefaults({
    spinner: QSpinnerPuff,
    message: 'Cargando...',
    messageColor: 'white',
    spinnerSize: 100, // in pixels
    spinnerColor: 'cyan',
    //customClass: 'bg-primary'
})

export default ({ Vue }) => {
    // Vue.use(general)
}
