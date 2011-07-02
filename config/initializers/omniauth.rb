# Taken from: http://www.communityguides.eu/articles/11
# Taken from: http://www.communityguides.eu/articles/16


# Hack, to work around Ruby 1.9.1 problem (as desribed here:
# http://situated.wordpress.com/2008/06/10/opensslsslsslerror-certificate-verify-failed-open-uri/
# http://fossplanet.com/f14/openssl-ruby-1-9-certificate-verify-failed-22304/

if Rails.env == 'development'
  require 'openssl'
  OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
end

Rails.application.config.middleware.use OmniAuth::Builder do
  # ALWAYS RESTART YOUR SERVER IF YOU MAKE CHANGES TO THESE SETTINGS!

    # you need a store for OpenID; (if you deploy on heroku you need Filesystem.new('./tmp') instead of Filesystem.new('/tmp'))
#    require 'openid/store/filesystem'
#
#   # load certificates
#   require "openid/fetchers"
#   OpenID.fetcher.ca_file = "#{Rails.root}/config/ca-bundle.crt"


     # providers with id/secret, you need to sign up for their services (see below) and enter the parameters here
    provider :facebook, '205901039456697', '65f0bc907d0b433343ef1e73b6cb8134'
#    provider :twitter, 'CONSUMER_KEY', 'CONSUMER_SECRET'
#    provider :github, 'CLIENT ID', 'SECRET'

    # generic openid
#    provider :openid, OpenID::Store::Filesystem.new('./tmp'), :name => 'openid'
#
#    # dedicated openid
#    provider :openid, OpenID::Store::Filesystem.new('./tmp'), :name => 'google', :identifier => 'https://www.google.com/accounts/o8/id'
#    # provider :google_apps, OpenID::Store::Filesystem.new('./tmp'), :name => 'google_apps'
#    # /auth/google_apps; you can bypass the prompt for the domain with /auth/google_apps?domain=somedomain.com
#
#    provider :openid, OpenID::Store::Filesystem.new('./tmp'), :name => 'yahoo', :identifier => 'yahoo.com'
#    provider :openid, OpenID::Store::Filesystem.new('./tmp'), :name => 'aol', :identifier => 'openid.aol.com'
#    provider :openid, OpenID::Store::Filesystem.new('./tmp'), :name => 'myopenid', :identifier => 'myopenid.com'
end
