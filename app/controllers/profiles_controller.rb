class ProfilesController < ApplicationController
  before_filter :authenticate_user!

  # GET /profiles
  # GET /profiles.xml
  def index
    @profiles = Profile.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @profiles }
    end
  end

  # GET /profiles/high_scores
  # GET /profiles.xml/high_scores
  def high_scores
    @profiles = Profile.where('highest_score is not null').order('highest_score DESC').limit(10)

    respond_to do |format|
      format.js # high_scores.js.erb
      format.html # high_scores.html.erb
      format.xml  { render :xml => @profiles }
    end
  end

  # GET /profiles/1
  # GET /profiles/1.xml
  def show
    @profile = Profile.find(params[:id])

    respond_to do |format|
      format.js   # _show.html.erb
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
    @profile = @profile.from_json(params[:profile_object])


    respond_to do |format|
      if @profile.save #update_attributes(params[:profile])
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
        format.html { redirect_to("/", :notice => 'Profile was successfully updated.') }
        format.xml  { head :ok }
        format.js
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @profile.errors, :status => :unprocessable_entity }
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
