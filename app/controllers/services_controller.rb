class ServicesController < ApplicationController
  before_filter :authenticate_user!, :except => [:create]

  
  def index
    # get all authentication services assigned to the current user
    @services = current_user.services.all
  end

  def destroy
    # remove an authentication service linked to the current user
    @service = current_user.services.find(params[:id])
    @service.destroy

    redirect_to services_path
  end

  def create
    # get the service parameter from the Rails router
    params[:service] ? service_route = params[:service] : service_route = 'no service (invalid callback)'

    omniauth = request.env['omniauth.auth']

    if omniauth and params[:service]
      # map the returned hashes to our variables first - the hashes differ for every service
      if service_route == 'facebook'
        omniauth['extra']['user_hash']['email'] ? email =  omniauth['extra']['user_hash']['email'] : email = ''
        omniauth['extra']['user_hash']['name'] ? name =  omniauth['extra']['user_hash']['name'] : name = ''
        omniauth['extra']['user_hash']['id'] ?  uid =  omniauth['extra']['user_hash']['id'] : uid = ''
        omniauth['provider'] ? provider =  omniauth['provider'] : provider = ''
      elsif service_route == 'github'
        omniauth['user_info']['email'] ? email =  omniauth['user_info']['email'] : email = ''
        omniauth['user_info']['name'] ? name =  omniauth['user_info']['name'] : name = ''
        omniauth['extra']['user_hash']['id'] ?  uid =  omniauth['extra']['user_hash']['id'] : uid = ''
        omniauth['provider'] ? provider =  omniauth['provider'] : provider = ''
      elsif service_route == 'twitter'
        email = ''    # Twitter API never returns the email address
        omniauth['user_info']['name'] ? name =  omniauth['user_info']['name'] : name = ''
        omniauth['uid'] ?  uid =  omniauth['uid'] : uid = ''
        omniauth['provider'] ? provider =  omniauth['provider'] : provider = ''
      else
        # we have an unrecognized service, just output the hash that has been returned
        render :text => omniauth.to_yaml
        #render :text => uid.to_s + " - " + name + " - " + email + " - " + provider
        return
      end
      omniauth['extra']['user_hash']['email'] ? email =  omniauth['extra']['user_hash']['email'] : email = ''
      omniauth['extra']['user_hash']['name'] ? name =  omniauth['extra']['user_hash']['name'] : name = ''
      omniauth['extra']['user_hash']['id'] ?  uid =  omniauth['extra']['user_hash']['id'] : uid = ''
      omniauth['provider'] ? provider =  omniauth['provider'] : provider = ''

      render :text => uid.to_s + " - " + name + " - " + email + " - " + provider
    else
      render :text => 'Error: Omniauth is empty'
    end
  end

end
