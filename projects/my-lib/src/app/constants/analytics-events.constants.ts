/*  
    Add events or page views list in the respective object and fire the events when user clicks on a button  
    or does some action. 
*/
// Page views are fired when a new page is loaded i.e Dashboard, login, etc..

export const eventsList = {
    LOGIN: 'login',
    REGISTER: 'sign_up',
    DISCOVERY: 'discover_accounts',
    LINKING: "link_accounts",
    DELINK: "delink_account",
    CHANGE_PIN: "change_pin",
    FORGOT_PIN: "forgot_pin",
    LOGOUT: "logout",
    ACTIVE_CONSENT: "active_consent",
    PAUSED_CONSENT: "paused_consent",
    REJECT_CONSENT: "reject_consent",
    REVOKE_CONSENT: "revoke_consent"
}

export const pageViewList = {
    LOGIN: 'login',
    REGISTER: 'sign_up',
    DASHBOARD: 'home',
    FORGOT_PIN: "forgot_pin",
    RECENT_ACTIVITIES: 'activity_log',
    CONSENTS_DASHBOARD: 'consents',
    ACCOUNTS_DASHBOARD: 'accounts',
    CONSENT_DETAIL: 'consent_detail',
    ACCOUNT_LINK_WIZARD: "account_link"
}