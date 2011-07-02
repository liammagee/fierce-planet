class User < ActiveRecord::Base
  after_create :create_profile

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me

  has_many :services, :dependent => :destroy


  has_one :profile

  def create_profile
    if profile.nil?
      p = Profile.new
      p.user = self
      p.save
      self.profile = p
    end
  end

  def self.find_for_facebook_oauth(access_token, signed_in_resource=nil)
    puts access_token
    data = access_token['extra']['user_hash']
    if user = User.find_by_email(data["email"])
      user
    else # Create a user with a stub password.
      User.create!(:email => data["email"], :password => Devise.friendly_token[0,20])
    end
  end

  def self.find_for_google_oauth(access_token, signed_in_resource=nil)
     data = access_token['user_info']
     if user = User.find_by_email(data["email"])
       user
     else # Create a user with a stub password.
       User.create!(:email => data["email"], :password => Devise.friendly_token[0,20])
     end
  end
end
