class User < ActiveRecord::Base
  after_create :create_profile

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

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
end
