export const analMixin = {
  methods: {
    sendEvent( category, action, value ) {
      if( process.env.NODE_ENV !== 'production' ) {
        return
      }
      ga('send', 'event', {
        eventCategory: category,
        eventAction: action,
        eventLabel: value,
        transport: 'beacon'
      });
    },
  }
}