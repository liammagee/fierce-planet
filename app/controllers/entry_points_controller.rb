class EntryPointsController < ApplicationController
  # GET /entry_points
  # GET /entry_points.xml
  def index
    @entry_points = EntryPoint.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @entry_points }
    end
  end

  # GET /entry_points/1
  # GET /entry_points/1.xml
  def show
    @entry_point = EntryPoint.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @entry_point }
    end
  end

  # GET /entry_points/new
  # GET /entry_points/new.xml
  def new
    @entry_point = EntryPoint.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @entry_point }
    end
  end

  # GET /entry_points/1/edit
  def edit
    @entry_point = EntryPoint.find(params[:id])
  end

  # POST /entry_points
  # POST /entry_points.xml
  def create
    @entry_point = EntryPoint.new(params[:entry_point])

    respond_to do |format|
      if @entry_point.save
        format.html { redirect_to(@entry_point, :notice => 'Entry point was successfully created.') }
        format.xml  { render :xml => @entry_point, :status => :created, :location => @entry_point }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @entry_point.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /entry_points/1
  # PUT /entry_points/1.xml
  def update
    @entry_point = EntryPoint.find(params[:id])

    respond_to do |format|
      if @entry_point.update_attributes(params[:entry_point])
        format.html { redirect_to(@entry_point, :notice => 'Entry point was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @entry_point.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /entry_points/1
  # DELETE /entry_points/1.xml
  def destroy
    @entry_point = EntryPoint.find(params[:id])
    @entry_point.destroy

    respond_to do |format|
      format.html { redirect_to(entry_points_url) }
      format.xml  { head :ok }
    end
  end
end
