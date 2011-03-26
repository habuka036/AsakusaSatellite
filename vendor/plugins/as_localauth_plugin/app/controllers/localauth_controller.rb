require 'digest/sha1'
class LocalauthController < ApplicationController
  before_filter :configured?
  def login
    if request.post?
      user_name = params[:login][:username]
      unless valid_local_user?(user_name, params[:login][:password])
        flash[:error] = 'login failed'
        return
      end

      users = User.select do |record|
        record['screen_name'] == user_name
      end
      user = (users.records.size > 0 ? users.first : User.new)
      user.screen_name ||= user_name
      user.name ||= LocalUser[user_name]['screen_name']
      user.profile_image_url = LocalUser[user_name]['profile_image_url']
      user.save
      session[:current_user_id] =  user.id 
      redirect_to :controller => 'chat', :action => 'index'
    end

  end

  private
  def valid_local_user?(user_name, password)
    LocalUser[user_name] and LocalUser[user_name]['password'] == Digest::SHA1.hexdigest(password.strip)
  end

  def configured?
    unless Setting[:login_link]
      logger.info "not configured!!"
      render :file => 'public/404.html'
    end
  end
end
