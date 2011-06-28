class ProfilesController < ApplicationController
#  before_filter :authenticate_user!

  # GET /profiles
  # GET /profiles.xml
  def index
    @profiles = Profile.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @profiles }
    end
  end

  # GET /profiles/1
  # GET /profiles/1.xml
  def show
    @profile = Profile.find(params[:id])

    respond_to do |format|
      format.html # _show.html.erb
      format.xml  { render :xml => @profile }
    end
  end

  # GET /profiles/new
  # GET /profiles/new.xml
  def new
    @profile = Profile.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @profile }
    end
  end

  # GET /profiles/1/edit
  def edit
    @profile = Profile.find(params[:id])
  end

  # POST /profiles
  # POST /profiles.xml
  def create
    @profile = Profile.new(params[:profile])

    respond_to do |format|
      if @profile.save
        format.js   { render :action => "update" }
        format.html { redirect_to(@profile, :notice => 'Profile was successfully created.') }
        format.xml  { render :xml => @profile, :status => :created, :location => @profile }
      else
        format.js   { render :action => "new" }
        format.html { render :action => "new" }
        format.xml  { render :xml => @profile.errors, :status => :unprocessable_entity }
      end
    end
  end

  # Note: only invoked
  # POST /profiles/1/update_stats
  # POST /profiles.xml/1/update_stats
  def update_stats
    @profile = Profile.find(params[:id])

    waves_survived = params[:waves_survived]
    saved_agent_count = params[:saved_agent_count]
    expired_agent_count = params[:expired_agent_count]
    resources_spent = params[:resources_spent]
    resources_in_store = params[:resources_in_store]
    resources = params[:resources]
    economic_resources = params[:economic_resources]
    environmental_resources = params[:environmental_resources]
    social_resources = params[:social_resources]
    credits = params[:credits]
    progress_towards_next_class = params[:progress_towards_next_class]

    @profile.total_saved ||= 0
    @profile.total_saved += saved_agent_count.to_i
    @profile.total_expired ||= 0
    @profile.total_expired += expired_agent_count.to_i
    @profile.total_resources ||= 0
    @profile.total_resources += resources.to_i
    @profile.total_economic_resources ||= 0
    @profile.total_economic_resources += economic_resources.to_i
    @profile.total_environmental_resources ||= 0
    @profile.total_environmental_resources += environmental_resources.to_i
    @profile.total_social_resources ||= 0
    @profile.total_social_resources += social_resources.to_i
    @profile.credits ||= 0
    @profile.credits += credits.to_i
    @profile.progress_towards_next_class = progress_towards_next_class.to_i

    respond_to do |format|
      if @profile.update_attributes(params[:profile])
        format.html { render :text => "Stats saved" }
        format.js { render :text => "Stats saved" }
      else
        format.html { render :text => "Could not save stats" }
        format.js { render :text => "Could not save stats" }
      end
    end
  end

  # PUT /profiles/1
  # PUT /profiles/1.xml
  def update
    @profile = Profile.find(params[:id])

    respond_to do |format|
      if @profile.update_attributes(params[:profile])
#        format.html { redirect_to("/", :notice => 'Profile was successfully updated.') }
#        format.xml  { head :ok }
        format.js   { render :action => "update" }
      else
#        format.html { render :action => "edit" }
#        format.xml  { render :xml => @profile.errors, :status => :unprocessable_entity }
        format.js   { render :action => "edit" }
      end
    end
  end

  # DELETE /profiles/1
  # DELETE /profiles/1.xml
  def destroy
    @profile = Profile.find(params[:id])
    @profile.destroy

    respond_to do |format|
      format.html { redirect_to(profiles_url) }
      format.xml  { head :ok }
    end
  end
end
